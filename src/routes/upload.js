import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomBytes } from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

try {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} catch (e) {
  console.warn('[upload] Could not create uploads dir:', e.message);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const safeExt = /^\.(jpe?g|png|gif|webp|avif|bmp|svg)$/i.test(ext) ? ext : '.jpg';
    const name = `${Date.now()}-${randomBytes(8).toString('hex')}${safeExt}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp|avif|bmp|svg\+xml)$/i.test(file.mimetype);
    if (allowed) cb(null, true);
    else cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP, AVIF, BMP, SVG).'), false);
  },
});

function uploadRouter() {
  const router = Router();
  router.post('/', (req, res) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'File too large (max 10MB).' });
        }
        return res.status(400).json({ success: false, message: err.message || 'Upload failed.' });
      }
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image file provided.' });
      }
      const url = '/uploads/' + req.file.filename;
      res.json({ success: true, url });
    });
  });
  return router;
}

export { uploadRouter, UPLOAD_DIR };
