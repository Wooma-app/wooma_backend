import path from "path";
import puppeteer from "puppeteer";
import {db, storage} from "../config/firebase";
import fs from "fs";
import sgMail from "@sendgrid/mail";
import {SENDGRID_API_KEY} from "../config/constant";
import {Image, Report, User} from "../interfaces";
import {getPdfTemplate} from "../helper/pdfTemplate";
import {updateReportStatus} from "./imageService";

sgMail.setApiKey(SENDGRID_API_KEY);

const pdfLocalPath = path.resolve(__dirname, "../../final_report.pdf");

export const generatePDF = async (htmlContent: string, outputPath: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
    margin: {top: "10mm", bottom: "10mm", left: "10mm", right: "10mm"},
  });
  await browser.close();
};

export const uploadPDF = async (reportId: string, pdfPath: string) => {
  const bucket = storage.bucket();
  const destPath = `reports/${reportId}/final_report.pdf`;
  await bucket.upload(pdfPath, {destination: destPath});

  // Update Firestore
  const pdfURL = await bucket.file(destPath).getSignedUrl({
    action: "read",
    expires: "03-01-2100",
  });

  await db.collection("reports").doc(reportId).update({
    isLocked: true,
    pdfUrl: pdfURL[0],
  });

  fs.unlinkSync(pdfPath);

  return pdfURL[0];
};

export const processPDF = async (reportId: string, userId: string) => {
  const userRef = db.collection("users").doc(userId);
  const user = await userRef.get();

  const reportRef = db.collection("reports").doc(reportId);
  const report = await reportRef.get();

  const {firstName, lastName} = user.data() as User;
  const {createdAt, city, state, addressLine1, postCode} = report.data() as Report;
  const localImagesRef = await reportRef.collection("local_images").get();
  const localImages = localImagesRef.docs.map((doc) => {
    const data = doc.data() as Image;
    const {storagePath, createdAt, type} = data;
    return {
      storagePath, createdAt, type,
    };
  });
  console.log(firstName, lastName);
  console.log(createdAt, city, state, addressLine1, postCode);
  console.log(localImages);

  const pdfTemplate = getPdfTemplate({
    firstName, lastName,
    createdAt, city, state, addressLine1, postCode,
    reportId, localImages,
  });
  await generatePDF(pdfTemplate, pdfLocalPath);
  const pdfStoragePath = await uploadPDF(reportId, pdfLocalPath);

  await updateReportStatus(reportId, "pdf_generated");

  return pdfStoragePath;
};

export const reportCleanup = async (reportId: string) => {
  await db.collection("reports").doc(reportId).update({
    cleanupStatus: "done",
  });
};


export const paymentSuccess = async (appUserId: string, reportId: string) => {
  // 1. Unlock the report
  await db.collection("reports").doc(reportId).update({
    status: "unlocked",
    paymentStatus: "paid",
    updatedAt: new Date(),
  });

  // 2. Generate secure PDF link (assuming file exists in Cloud Storage)
  const file = storage.bucket().file(`reports/${reportId}/final_report.pdf`);
  const [secureUrl] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 1000 * 60 * 60 * 24, // 24 hrs
  });

  // 3. Get user's email
  const userDoc = await db.collection("users").doc(appUserId).get();
  const email = userDoc.data()?.email;

  if (!email) return console.warn(`No email found for ${appUserId}`);

  // 4. Send email
  await sgMail.send({
    to: email,
    from: "noreply@wooma.app",
    subject: "Your Report is Ready",
    html: `<p>Your report is now unlocked. <a href="${secureUrl[0]}">Click here to view the PDF</a></p>`,
  });

  console.log(`Unlocked and emailed report ${reportId} to ${email}`);
};
