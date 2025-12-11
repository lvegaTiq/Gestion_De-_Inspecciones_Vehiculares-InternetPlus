import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, "..", "uploads", "conductores");
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const originalName = file.originalname;
      const ext = path.extname(originalName);
      const base = path.basename(originalName, ext);

      let finalName = originalName;
      let counter = 1;

      while (fs.existsSync(path.join(uploadPath, finalName))) {
        finalName = `${base}(${counter})${ext}`;
        counter++;
      }

      cb(null, finalName);
    }

});

const fileFilter = (req, file, cb) => {
  const mimeAllowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  mimeAllowed.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Formato de archivo no permitido"), false);
};

export const uploadLicencia = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
