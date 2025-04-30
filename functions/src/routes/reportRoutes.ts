import express from "express";
import {onGeneratePDFHandler, onGetReportListHandler, onProcessPayment, onVerifyPaymentSuccess} from "../controllers/reportController";

const router = express.Router();

router.post("/generate-pdf", onGeneratePDFHandler);
router.post("/process-payment", onProcessPayment);
router.post("/verify-payment", onVerifyPaymentSuccess);
router.get("/report-list", onGetReportListHandler);

export default router;
