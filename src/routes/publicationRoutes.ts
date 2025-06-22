import express from "express";
import upload from "../config/multerConfig";
import {
  addPublication,
  getPublications,
  getPublicationById,
  updatePublication,
  deletePublication,
} from "../controllers/publicationController";

const router = express.Router();

// Reusable file upload middleware with error handling
const fileUploadMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "video", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ])(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message || "File upload failed"
      });
    }
    next();
  });
};

// Routes
router.post("/publications", fileUploadMiddleware, addPublication);
router.get("/publications", getPublications);
router.get("/publications/:id", getPublicationById);
router.put("/publications/:id", fileUploadMiddleware, updatePublication);
router.delete("/publications/:id", deletePublication);

export default router;