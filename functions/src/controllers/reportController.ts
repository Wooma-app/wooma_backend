import {Request, Response} from "express";
import {paymentSuccess} from "../services/reportService";
import {db} from "../config/firebase";
import {REVENUECAT_API_KEY} from "../config/constant";
import {Report, User} from "../interfaces";

// Handler for Generating PDF and Report Finalising
export const onGeneratePDFHandler = async (req: Request, res: Response) => {
  // const {reportId, userId} = req.body;

  // const userRef = db.collection("users").doc(userId);
  // const user = await userRef.get();

  // const reportRef = db.collection("reports").doc(reportId);
  // const report = await reportRef.get();

  // const {firstName, lastName} = user.data() as User;
  // const {createdAt, city, state, addressLine1, postCode} = report.data() as Report;
  // console.log(firstName, lastName);
  // console.log(createdAt, city, state, addressLine1, postCode);

  // const pdfTemplate = getPdfTemplate({
  //   firstName, lastName,
  //   createdAt, city, state, addressLine1, postCode,
  //   reportId,
  // });
  // await generatePDF(pdfTemplate, pdfLocalPath);
  // const pdfStoragePath = await uploadPDF(reportId, pdfLocalPath);

  // await updateReportStatus(reportId, "pdf_generated");

  res.json({
    success: true,
    // pdfStoragePath,
  });
};

// Handler for logging payment data to firebase database
export const onProcessPayment = async (req: Request, res: Response) => {
  const {appUserId, reportId} = req.body;

  try {
    const response = await fetch(`https://api.revenuecat.com/v1/subscribers/${appUserId}`, {
      headers: {
        Authorization: `Bearer ${REVENUECAT_API_KEY}`,
      },
    });

    const data = await response.json();
    const entitlements = data.subscriber?.entitlements ?? {};

    const activeEntitlement: any = Object.values(entitlements).find((e: any) => e?.is_active === true);

    if (!activeEntitlement) {
      res.status(403).send("No active entitlement");
      return;
    }

    const productId = activeEntitlement.product_identifier;
    const transactionId = activeEntitlement.transaction_id || `txn_${Date.now()}`;

    // Save payment record
    await db.collection("payments").doc(transactionId).set({
      appUserId,
      reportId,
      productId,
      entitlement_id: activeEntitlement.identifier,
      purchase_date: activeEntitlement.purchase_date,
      expires_date: activeEntitlement.expires_date ?? null,
      is_trial_period: activeEntitlement.is_trial_period ?? false,
      created_at: new Date().toString(),
    });

    // Unlock the report
    await db.collection("reports").doc(reportId).update({
      isLocked: false,
      updatedAt: new Date().toString(),
    });

    res.status(200).send("Report unlocked and payment saved");
  } catch (err) {
    console.error("Error verifying RevenueCat entitlement:", err);
    res.status(500).send("Failed to verify entitlement");
  }
};

export const onVerifyPaymentSuccess = async (req: Request, res: Response) => {
  const {receiptData, appUserId, reportId} = req.body;

  try {
    // Step 1: Send receipt data to RevenueCat API for validation
    const response = await fetch("https://api.revenuecat.com/v1/receipts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${REVENUECAT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receipt_data: receiptData, // Receipt data from the frontend (for iOS)
        app_user_id: appUserId, // The unique user ID
      }),
    });

    // Parse the response from RevenueCat
    const data = await response.json();

    // Check if the response is valid and contains subscription data
    if (response.status !== 200 || !data.subscriber || !data.subscriber.entitlements) {
      console.error("Payment verification failed:", data);
      res.status(400).send("Payment verification failed or entitlement data missing");
      return;
    }

    // Step 2: Check if the entitlement is active
    const activeEntitlement = Object.values(data.subscriber.entitlements).find((entitlement: any) => entitlement.is_active);

    if (!activeEntitlement) {
      res.status(403).send("Payment not successful or entitlement inactive");
      return;
    }

    // Step3: Deal with the payment success features
    await paymentSuccess(appUserId, reportId);

    // Step 4: Send a confirmation response to the frontend
    res.status(200).send({
      status: "success",
      message: "Payment successful. Report unlocked.",
      entitlement: activeEntitlement, // Optional: Return entitlement details if needed
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).send("Error verifying payment");
  }
};

// Handler for getting report lists.
export const onGetReportListHandler = async (req: Request, res: Response) => {
  const {userId} = req.query;

  try {
    const reportRef = db.collection("reports");
    const querySnapshot = await reportRef.where("userId", "==", userId).get();

    let unfinished = 0;
    const reports = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const data = doc.data() as Report;

      if (!(data.status === "completed" || data.paymentStatus === "paid")) {
        unfinished ++;
      }

      const spaceLength = data.spaces.length;
      const len = spaceLength === undefined || spaceLength === 0 ? 1 : spaceLength;
      const draftPercent = data.status === "draft" ?
        {draftPercent: (data.spaceCompleted*1.0 / len) * 100} : {};
      return {
        reportId: doc.id,
        ...draftPercent,
        ...data,
      };
    }));

    // Sort the reports by the updatedAt value
    reports.sort((a: any, b: any) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());

    res.json({
      unfinished,
      reports,
    });
  } catch (err) {
    res.json({
      message: "something went wrong",
    });
  }
};

// Handler for getting report lists for admin panel.
export const onGetAdminReportListHandler = async (req: Request, res: Response) => {
  const {status, paymentStatus} = req.query;

  try {
    let reportRef = db.collection("reports") as FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
    if (status !== "") {
      reportRef = reportRef.where("status", "==", status);
    }
    if (paymentStatus !== "") {
      reportRef = reportRef.where("paymentStatus", "==", paymentStatus);
    }
    const querySnapshot = await reportRef.get();

    const reports = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const data = doc.data() as Report;

      const userDoc = await db.collection("users").doc(data.userId).get();
      const user = userDoc.data() as User;

      return {
        ...data,
        reportId: doc.id,
        phoneNumber: user?.phoneNumber,
      };
    }));

    // Sort the reports by the updatedAt value
    reports.sort((a: any, b: any) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());

    res.json({reports});
  } catch (err) {
    console.log(err);
    res.json({
      message: "something went wrong",
    });
  }
};

// Handler for getting user lists for admin panel.
export const onGetAdminUserListHandler = async (req: Request, res: Response) => {
  const {userId} = req.query;

  try {
    const userRef = db.collection("users");

    const querySnapshot = await userRef.get();

    const users = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const data = doc.data() as User;

      const reportsDoc = await db.collection("reports").where("userId", "==", userId).get();
      const reportsCreated = reportsDoc.docs.length;
      let reportsPaid = 0;
      reportsDoc.docs.map(async (doc) => {
        const data = doc.data() as Report;
        if (data.paymentStatus === "paid") {
          reportsPaid ++;
        }
      });

      return {
        reportId: doc.id,
        reportsCreated,
        reportsPaid,
        ...data,
      };
    }));

    res.json({
      users,
    });
  } catch (err) {
    res.json({
      message: "something went wrong",
    });
  }
};
