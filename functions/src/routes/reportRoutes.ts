import express from "express";
import {
  onGeneratePDFHandler,
  onGetReportListHandler,
  onGetAdminReportListHandler,
  onProcessPayment,
  onVerifyPaymentSuccess,
  onGetAdminUserListHandler,
} from "../controllers/reportController";

const router = express.Router();

router.post("/generate-pdf", onGeneratePDFHandler);
router.post("/process-payment", onProcessPayment);
router.post("/verify-payment", onVerifyPaymentSuccess);
router.get("/report-list", onGetReportListHandler);
router.get("/admin-report-list", onGetAdminReportListHandler);
router.get("/admin-user-list", onGetAdminUserListHandler);

export default router;
