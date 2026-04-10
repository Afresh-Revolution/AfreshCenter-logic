import { Router } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// ── Cloudinary configuration ─────────────────────────────────────────────────
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

const cloudinaryReady =
  CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET;

if (cloudinaryReady) {
  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key:    CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });
  console.log('[upload] Cloudinary enabled — uploads will be persistent.');
} else {
  console.warn(
    '[upload] CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET not set. ' +
    'Image uploads will fail until these are configured.'
  );
}

// ── Multer — always memory storage (we stream straight to Cloudinary) ─────────
const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp|avif|bmp|svg\+xml)$/i.test(
      file.mimetype
    );
    if (allowed) cb(null, true);
    else
      cb(
        new Error(
          'Only image files are allowed (JPEG, PNG, GIF, WebP, AVIF, BMP, SVG).'
        ),
        false
      );
  },
});

// ── Helper: upload a buffer to Cloudinary via a stream ───────────────────────
function uploadToCloudinary(buffer, mimetype, folder = 'afreshcenter') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        // Cloudinary auto-detects format; override only when needed
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

// ── Router ────────────────────────────────────────────────────────────────────
function uploadRouter() {
  const router = Router();

  router.post('/', (req, res) => {
    uploadMiddleware.single('image')(req, res, async (err) => {
      if (err) {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'File too large (max 10MB).' });
        }
        return res.status(400).json({ success: false, message: err.message || 'Upload failed.' });
      }

      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image file provided.' });
      }

      if (!cloudinaryReady) {
        return res.status(503).json({
          success: false,
          message: 'Image storage is not configured. Please contact the administrator.',
        });
      }

      try {
        const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
        return res.json({
          success: true,
          secure_url: result.secure_url,      // HTTPS URL — safe to store in Supabase DB
          public_id: result.public_id, // useful if you later want to delete/transform
        });
      } catch (e) {
        console.error('[upload] Cloudinary upload error:', {
          message: e.message,
          http_code: e.http_code,
          name: e.name,
          stack: e.stack
        });
        return res.status(500).json({
          success: false,
          message: 'Failed to store image.',
          reason: e.message || 'Cloudinary upload failed',
          details: {
            code: e.http_code,
            type: e.name
          }
        });
      }
    });
  });

  return router;
}

export { uploadRouter };
