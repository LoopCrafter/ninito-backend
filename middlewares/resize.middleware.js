import path from "path";
import sharp from "sharp";

export const resizeImage = (uploadPath) => async (req, res, next) => {
  if (!req.file) return next();
  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname);
  const filename = req.file.filename.replace(ext, `-resized${ext}`);
  const outputPath = path.join(uploadPath, filename);
  console.log("resize", { filePath, ext, filename, outputPath });

  try {
    await sharp(filePath)
      .resize(200, 200, { fit: "contain" })
      .toFile(outputPath);

    req.file.filename = filename;
    req.file.path = outputPath;

    next();
  } catch (error) {
    console.error("Error resizing image:", err);
    return res.status(500).json({ msg: "Image processing failed" });
  }
};
