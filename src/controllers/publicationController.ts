// import { Request, Response } from "express";
// import { upload } from "../utils/upload";

// export const createPublication = async (req: Request, res: Response) => {
//   try {
//     const { title, shortDescription, isOngoing, disclaimer } = req.body;
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//     const image = files?.image?.[0]?.path;
//     const pdf = files?.pdf?.[0]?.path;

//     // Save to MongoDB (Publication Model)
//     res.status(201).json({ success: true, data: { title, image, pdf } });
//   } catch (err) {
//     res.status(500).json({ success: false, error: "Upload failed" });
//   }
// };