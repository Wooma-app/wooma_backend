import {Request, Response} from "express";
import {db} from "../config/firebase";
import {Report} from "../interfaces";
import {saveImageMetadata, saveSpaceMetadata, updateReportStatus, uploadImage} from "../services/imageService";
import {processPDF} from "../services/reportService";

// Handler for creating new report with property for a user.
export const onCreateReportHandler = async (req: Request, res: Response) => {
  try {
    console.log("Create new Report");
    const {data} = req.body;
    const {addressLine1, city, state, postCode, userId} = data;

    const propertyRef = db.collection("properties").doc();
    await propertyRef.set({
      addressLine1, city, state, postCode,
      createdAt: new Date().toString(),
      createdBy: userId,
    });

    const reportData = {
      ...data,
      propertyId: propertyRef.id,
      pdfUrl: "",
      status: "draft",
      isLocked: false,
      paymentStatus: "unpaid",
      spaceCompleted: 0,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    };

    const reportRef = db.collection("reports").doc();
    await reportRef.set(reportData);

    res.json({reportId: reportRef.id, propertyId: propertyRef.id});
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(500).json({error: err.message || "Internal server error"});
  }
};

// Handler for maintaining a lightweight metadata entry in Firestore.
export const onBeforeImageUploadHandler = async (req: Request, res: Response) => {
  const {reportId, spaceData, imageData} = req.body;

  try {
    spaceData.map(async (space: any) => {
      const spaceId = await saveSpaceMetadata(reportId, space.name, space.issues);
      const images = imageData[space.name];

      images.map(async (image: any) => {
        await saveImageMetadata(reportId, spaceId, image);
      });

      const reportRef = db.collection("reports").doc(reportId);
      const reportDoc = await reportRef.get();
      if (!reportDoc.exists) {
        console.log("No such document!");
        return;
      }

      const report = reportDoc.data() as Report;
      await reportRef.update({spaceCompleted: report.spaceCompleted + 1});
    });

    res.json({success: true, message: "Image metadata saved successfully."});
  } catch (error) {
    console.log("Saving image metadata failed: ", error);
    res.json({success: false});
  }
};

export const onImageUploadHandler = async (req: Request, res: Response) => {
  const {reportId} = req.body;
  const images = req.files as Express.Multer.File[];

  if (!images || images.length === 0) {
    res.status(400).json({message: "No images provided"});
    return;
  }

  const reportRef = db.collection("reports").doc(reportId);
  const reportDoc = await reportRef.get();

  if (!reportDoc.exists) {
    res.status(404).json({message: "Report not found"});
    return;
  }

  const report = reportDoc.data() as Report;
  const propertyId = report.propertyId;
  const imageMeta = await reportRef.collection("local_images").get();

  if (imageMeta.empty) {
    res.status(404).json({message: "No image metadata found"});
    return;
  }

  let uploadedCount = 0;

  await Promise.all(
    imageMeta.docs.map(async (doc) => {
      const data = doc.data();
      const image = images.find((img) => data.filename.toLowerCase() === img.originalname.toLowerCase());

      if (!image || data.uploadStatus === "complete") return;

      try {
        await uploadImage(doc.id, reportId, propertyId, image);
        uploadedCount++;
      } catch (err) {
        console.error(`Failed to upload ${data.filename}`, err);
      }
    })
  );

  let pdfStoragePath = "";
  if (uploadedCount === imageMeta.docs.length) {
    await updateReportStatus(reportId, "completed");
    pdfStoragePath = await processPDF(reportId, report.userId);
  } else await updateReportStatus(reportId, "failed");

  res.status(200).json({
    message: uploadedCount > 0 ?
      `${uploadedCount} image(s) uploaded successfully` :
      "No images were uploaded (all complete or unmatched)",
    pdfStoragePath,
  });
};

