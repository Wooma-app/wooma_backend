import express from "express";
import {onBeforeImageUploadHandler, onCreateReportHandler, onImageUploadHandler} from "../controllers/imageController";
import multer from "multer";

const router = express.Router();

const multipartFormDataParser = multer({
  storage: multer.memoryStorage(),
  // increase size limit if needed
  limits: {fileSize: 10 * 1024 * 1024},
  // support firebase cloud functions
  // the multipart form-data request object is pre-processed by the cloud functions
  // currently the `multer` library doesn't natively support this behaviour
  // as such, a custom fork is maintained to enable this by adding `startProcessing`
  // https://github.com/emadalam/multer
  startProcessing(req: any, busboy: any) {
    req.rawBody ? busboy.end(req.rawBody) : req.pipe(busboy);
  },
});

router.post("/create-report", onCreateReportHandler);
router.post("/save-imagedata", onBeforeImageUploadHandler);
router.post("/upload", multipartFormDataParser.any(), onImageUploadHandler);
// router.post("/report-update-status", updateReportStatus);

export default router;
