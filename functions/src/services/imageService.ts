/* eslint-disable linebreak-style */
import sharp from "sharp";
import {createHash} from "crypto";
import {db, storage} from "../config/firebase";
import {onSchedule} from "firebase-functions/v2/scheduler";

// Function to track unsynced images. Save image and space metadata to be uploaded
export const saveSpaceMetadata = async (
  reportId: string,
  spaceName: string,
  issues: []
) => {
  const spaceRef = db.collection("spaces").doc();
  await spaceRef.set({
    name: spaceName,
    reportId,
    issues,
    createdAt: new Date().toString(),
  });

  return spaceRef.id;
};

export const saveImageMetadata = async (
  reportId: string,
  spaceId: string,
  image: any,
) => {
  const {id, filename, type, localIdentifier, issue} = image;
  console.log("----img", image);
  const localImageRef = db.collection(`reports/${reportId}/local_images`).doc(id);
  await localImageRef.set({
    spaceId,
    uploadStatus: "pending",
    storagePath: "",
    hash: "",
    filename,
    type,
    localIdentifier,
    issue: issue || "",
    createdAt: new Date().toString(),
  });
};

// Function to update report status in Firebase database
export const updateReportStatus = async (
  reportId: string,
  status: string
) => {
  const reportRef = db.collection("reports").doc(reportId);
  await reportRef.update({status});
};

// Function to update image upload status in Firebase database
export const updateUploadStatus = async (
  reportId: string,
  imageId: string,
  status: string
) => {
  const imageRef = db.collection(`reports/${reportId}/local_images`).doc(imageId);
  await imageRef.update({uploadStatus: status});
};

// Function to upload an image
export const uploadImage = async (
  imageId: string,
  reportId: string,
  propertyId: string,
  image: Express.Multer.File | undefined
) => {
  try {
    // Compress the image using Sharp.js
    const compressedImageBuffer = await sharp(image?.buffer)
      .resize({width: 800}) // Resize to reduce size (you can adjust this)
      .jpeg({quality: 70}) // Compress the image by 50-70%
      .toBuffer();

    // Hash the image buffer for deduplication
    const imageHash = createHash("md5").update(compressedImageBuffer).digest("hex");

    // Check if the image with the same hash already exists in Firestore
    const existingImageRef = await db
      .collection("reports")
      .doc(reportId)
      .collection("local_images")
      .where("hash", "==", imageHash)
      .get();

    if (!existingImageRef.empty) {
      // If image with the same hash already exists, don't upload
      console.log("Duplicate image detected. Skipping upload.");
      return false;
    }

    // Update the upload status in Firestore to "in_progress"
    await updateUploadStatus(reportId, imageId, "in_progress");

    // Upload the compressed image to Firebase Storage
    const bucket = storage.bucket();
    const filePath = `properties/${propertyId}/reports/${reportId}/images/${image?.originalname}`;
    const file = bucket.file(filePath);
    await file.save(compressedImageBuffer, {
      contentType: image?.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: imageId, // Required for generating public URL
      },
    });

    const downloadUrl = await file.getSignedUrl({
      action: "read",
      expires: "01-01-2100",
    });

    // Update Firestore metadata with the image hash to prevent future duplicates
    // Update the upload status to "complete"
    await db.collection("reports")
      .doc(reportId)
      .collection("local_images")
      .doc(imageId)
      .update({
        uploadStatus: "complete",
        storagePath: downloadUrl[0],
        hash: imageHash, // Save hash to detect duplicates later
        uploadedAt: new Date().toString(),
      });

    console.log("Image uploaded and compressed successfully");
    return true;
  } catch (error) {
    console.error("Upload failed:", imageId, error);
    await updateUploadStatus(reportId, imageId, "failed");

    return false;
  }
};

const retryDelays = [5000, 15000, 45000, 120000]; // 5s → 15s → 45s → 2 mins

export const uploadWithRetry = async (
  imageId: string,
  reportId: string,
  propertyId: string,
  image: Express.Multer.File,
  attempt = 0
)
  : Promise<boolean> => {
  if (attempt > 0) {
    const delay = retryDelays[attempt - 1];
    console.warn(`Retrying upload for ${imageId} in ${delay / 1000}s (Attempt ${attempt})`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  const success = await uploadImage(imageId, reportId, propertyId, image);
  if (success) return true;

  if (attempt >= retryDelays.length) {
    console.error(`Upload failed after ${attempt} attempts: ${imageId}`);
    return false;
  }

  return uploadWithRetry(imageId, reportId, propertyId, image, attempt + 1);
};

const HOURS = 72;
const MILLISECONDS_IN_HOUR = 60 * 60 * 1000;
const cutoffDate = new Date(Date.now() - HOURS * MILLISECONDS_IN_HOUR);

export const cleanStaleImages = async () => {
  try {
    const snapshot = await db.collectionGroup("local_images")
      .where("createdAt", "<=", cutoffDate)
      .where("status", "!=", "complete") // Optional: skip complete images
      .get();

    if (snapshot.empty) {
      console.log("✅ No stale images found.");
      return;
    }

    console.log(`🗑 Found ${snapshot.size} stale image entries. Deleting...`);

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log("✅ Stale image metadata deleted successfully.");
  } catch (error) {
    console.error("❌ Error while deleting stale images:", error);
  }
};

export const scheduledCleanup = onSchedule(
  {
    schedule: "every 24 hours", // or cron format: '0 3 * * *' for every day at 3AM
    timeZone: "UTC", // optional
  },
  async () => {
    console.log("🔄 Running scheduled stale image cleanup...");
    await cleanStaleImages();
  }
);
