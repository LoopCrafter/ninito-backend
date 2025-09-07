import multer from "multer";
import path from "path";
import fs from "fs";

class FileUploaderManager {
  constructor() {
    if (FileUploaderManager.instance) {
      return FileUploaderManager.instance;
    }
    this.uploaders = {};
    FileUploaderManager.instance = this;
  }

  getUploader(uploadPath) {
    if (!this.uploaders[uploadPath]) {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      const storage = multer.diskStorage({
        destination: (req, file, cb) => cb(null, uploadPath),
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          const name = file.fieldname + "-" + Date.now() + ext;
          cb(null, name);
        },
      });

      this.uploaders[uploadPath] = multer({ storage });
    }
    return this.uploaders[uploadPath];
  }

  single(uploadPath, fieldName) {
    return this.getUploader(uploadPath).single(fieldName);
  }

  multiple(uploadPath, fieldName, maxCount = 10) {
    return this.getUploader(uploadPath).array(fieldName, maxCount);
  }

  fields(uploadPath, fieldsConfig) {
    return this.getUploader(uploadPath).fields(fieldsConfig);
  }
}

export default new FileUploaderManager();
