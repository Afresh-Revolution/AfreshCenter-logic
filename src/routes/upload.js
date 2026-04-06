import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomBytes } from 'crypto';

// ── Supabase Storage (preferred — survives Render restarts) ──────────────────
let supabase = null;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY) {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    console.log('[upload] Supabase Storage enabled — uploads will be persistent.');
  } catch (e) {
    console.warn('[upload] Failed to initialise Supabase client:', e.message);
  }
} else {
  console.warn(
    '[upload] SUPABASE_URL / SUPABASE_SERVICE_KEY not set. ' +
    'Falling back to local disk storage (images will be lost on Render restart).'
  );
}

// ── Local disk fallback ───────────────────────────────────────────────────────
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
try {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} catch (e) {
  console.warn('[upload] Could not create uploads dir:', e.message);
}

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const safeExt = /^\.(jpe?g|png|gif|webp|avif|bmp|svg)$/i.test(ext) ? ext : '.jpg';
    cb(null, `${Date.now()}-${randomBytes(8).toString('hex')}${safeExt}`);
  },
});

// Use memory storage when Supabase is available, disk storage as fallback
const uploadMiddleware = multer({
  storage: supabase ? multer.memoryStorage() : diskStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp|avif|bmp|svg\+xml)$/i.test(file.mimetype);
    if (allowed) cb(null, true);
    else cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP, AVIF, BMP, SVG).'), false);
  },
});

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

      // ── Supabase path ─────────────────────────────────────────────────────
      if (supabase) {
        try {
          const ext = path.extname(req.file.originalname) || '.jpg';
          const safeExt = /^\.(jpe?g|png|gif|webp|avif|bmp|svg)$/i.test(ext) ? ext : '.jpg';
          const filename = `${Date.now()}-${randomBytes(8).toString('hex')}${safeExt}`;

          const { error: uploadError } = await supabase.storage
            .from(BUCKET)
            .upload(filename, req.file.buffer, {
              contentType: req.file.mimetype,
              upsert: false,
            });

          if (uploadError) {
            console.error('[upload] Supabase Storage error:', uploadError);
            return res.status(500).json({ success: false, message: 'Failed to store image.' });
          }

          const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(filename);
          return res.json({ success: true, url: urlData.publicUrl });
        } catch (e) {
          console.error('[upload] Supabase upload error:', e);
          return res.status(500).json({ success: false, message: 'Upload failed.' });
        }
      }

      // ── Disk fallback path ────────────────────────────────────────────────
      const url = '/uploads/' + req.file.filename;
      return res.json({ success: true, url });
    });
  });

  return router;
}

export { uploadRouter, UPLOAD_DIR };
