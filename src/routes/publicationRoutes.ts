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

// File upload middleware with error handling
const handleFileUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
  { name: "pdf", maxCount: 1 }
]);

// Apply to both POST and PUT routes
const fileUploadMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  handleFileUpload(req, res, (err: any) => {
    if (err) {
      return res.status(400).json({ 
        success: false, 
        error: err.message || "File upload failed" 
      });
    }
    next();
  });
};

router.post("/publications", fileUploadMiddleware, addPublication);
router.get("/publications", getPublications);
router.get("/publications/:id", getPublicationById);
router.put("/publications/:id", fileUploadMiddleware, updatePublication);
router.delete("/publications/:id", deletePublication);

export default router;