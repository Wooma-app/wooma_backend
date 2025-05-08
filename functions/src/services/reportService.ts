import path from "path";
// import puppeteer from "puppeteer";
import * as puppeteer from "puppeteer";
import {db, storage} from "../config/firebase";
import fs from "fs";
import sgMail from "@sendgrid/mail";
import {SENDGRID_API_KEY} from "../config/constant";
import {Image, Report, Space} from "../interfaces";
import {getPdfTemplate} from "../helper/pdfTemplate";
import {updateReportStatus} from "./imageService";

sgMail.setApiKey(SENDGRID_API_KEY);

const pdfLocalPath = path.resolve(__dirname, "../../final_report.pdf");

export const generatePDF = async (htmlContent: string, outputPath: string) => {
  // const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-gpu",
    ],
  });
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
  // const userRef = db.collection("users").doc(userId);
  // const user = await userRef.get();

  const reportRef = db.collection("reports").doc(reportId);
  const report = await reportRef.get();

  const {createdAt, city, state, addressLine1, postCode} = report.data() as Report;
  const localImagesRef = await reportRef.collection("local_images").get();
  const localImages = await Promise.all(
    localImagesRef.docs.map(async (doc) => {
      const data = doc.data() as Image;
      const {storagePath, createdAt, type, spaceId} = data;

      const spaceRef = db.collection("spaces").doc(spaceId);
      const spaceDoc = await spaceRef.get();
      const {name: spaceName, issues} = spaceDoc.data() as Space;

      return {
        spaceName, issues, storagePath, createdAt, imageType: type,
      };
    })
  );

  const images = transformImages(localImages);

  const pdfTemplate = getPdfTemplate({
    createdAt, city, state, addressLine1, postCode,
    reportId, images,
  });

  await generatePDF(pdfTemplate, pdfLocalPath);
  const pdfStoragePath = await uploadPDF(reportId, pdfLocalPath);

  await updateReportStatus(reportId, "pdf_generated");

  return pdfStoragePath;
};

const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const transformImages = (images: any) => {
  const result: any = {};

  for (const item of images) {
    const {spaceName, storagePath, createdAt, imageType, issues} = item;
    const issueSummary = issues
      .map((issue: any) => `${capitalize(issue.title)}—${issue.content.toUpperCase()}`)
      .join(". ") + ".";

    if (!result[spaceName]) {
      result[spaceName] = {general: [], issue: [], issueSummary};
    }

    result[spaceName][imageType].push({storagePath, createdAt});
  }

  return result;
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
    updatedAt: new Date().toString(),
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
