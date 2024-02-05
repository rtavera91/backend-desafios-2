import multerMiddleware from "./../uploader.js";
import { uploadDocument } from "../controllers/users.controller.js";

const documentUploader = multerMiddleware.single("document");

export default (req, res, next) => {
  documentUploader(req, res, (err) => {
    if (err) {
      console.log("Error uploading file:", err.message);
      return res.status(400).json({ message: "Error uploading file" });
    }
    uploadDocument(req, res, next);
  });
};
