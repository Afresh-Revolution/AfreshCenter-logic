import { Router } from 'express';

const SERVICE_COLS =
  'id, title, category, price_range, image_url, description, total_bookings, visible, created_at' +
  ', background_image_url, short_description, overview, overview_image_url, key_features, benefits, what_you_get';

function textToArray(val) {
  if (val == null || val === '') return [];
  const s = typeof val === 'string' ? val : String(val);
  return s.split('\n').map((x) => x.trim()).filter(Boolean);
}

function arrayToText(arr) {
  if (!Array.isArray(arr)) return typeof arr === 'string' ? arr : '';
  return arr.filter(Boolean).join('\n');
}

function mapRow(s) {
  return {
    id: String(s.id),
    title: s.title,
    category: s.category,
    priceRange: s.price_range,
    imageUrl: s.image_url ?? null,
    description: s.description ?? null,
    totalBookings: Number(s.total_bookings ?? 0),
    status: s.visible ? 'Active' : 'Inactive',
    visible: !!s.visible,
    backgroundImageUrl: s.background_image_url ?? null,
    shortDescription: s.short_description ?? null,
    overview: s.overview ?? null,
    overviewImageUrl: s.overview_image_url ?? null,
    keyFeatures: textToArray(s.key_features),
    benefits: textToArray(s.benefits),
    whatYouGet: textToArray(s.what_you_get),
  };
}

/**
 * adminServices routes using Postgres.
 * Table: services — base columns plus background_image_url, short_description, overview,
 * overview_image_url, key_features, benefits, what_you_get (run migrations/001_add_service_detail_fields.sql).
 */
function adminServices(pool) {
  const router = Router();

  // GET /admin/services — list all services (for admin dashboard)
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT ${SERVICE_COLS} FROM services ORDER BY created_at DESC`
      );
      res.json(result.rows.map(mapRow));
    } catch (e) {
      console.error('GET /admin/services', e);
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  });

  // POST /admin/services — create a new service
  router.post('/', async (req, res) => {
    try {
      const {
        title,
        category,
        priceRange,
        imageUrl,
        description,
        visible,
        backgroundImageUrl,
        shortDescription,
        overview,
        overviewImageUrl,
        keyFeatures,
        benefits,
        whatYouGet,
      } = req.body || {};
      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Title is required',
          errors: [{ field: 'title', message: 'Title is required' }],
        });
      }

      const insertCols =
        'title, category, price_range, image_url, description, total_bookings, visible' +
        ', background_image_url, short_description, overview, overview_image_url, key_features, benefits, what_you_get';
      const placeholders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => `$${i}`).join(', ');
      const text = `INSERT INTO services (${insertCols}) VALUES (${placeholders}) RETURNING ${SERVICE_COLS}`;
      const values = [
        String(title).trim(),
        String(category ?? 'General').trim(),
        String(priceRange ?? '').trim(),
        imageUrl ? String(imageUrl).trim() : null,
        description ? String(description).trim() : null,
        0,
        visible !== false,
        backgroundImageUrl ? String(backgroundImageUrl).trim() : null,
        shortDescription ? String(shortDescription).trim() : null,
        overview ? String(overview).trim() : null,
        overviewImageUrl ? String(overviewImageUrl).trim() : null,
        arrayToText(keyFeatures),
        arrayToText(benefits),
        arrayToText(whatYouGet),
      ];
      const result = await pool.query(text, values);
      res.status(201).json({
        success: true,
        message: 'Service created successfully',
        service: mapRow(result.rows[0]),
      });
    } catch (e) {
      console.error('POST /admin/services', e);
      res.status(500).json({
        success: false,
        message: 'Failed to create service',
        error: e.message,
      });
    }
  });

  // PATCH /admin/services/:id/visibility — toggle visible on main page
  router.patch('/:id/visibility', async (req, res) => {
    try {
      const { id } = req.params;
      const { visible } = req.body ?? {};

      const find = await pool.query(`SELECT ${SERVICE_COLS} FROM services WHERE id = $1`, [id]);
      if (find.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Service not found',
        });
      }
      const current = find.rows[0];
      const nextVisible = typeof visible === 'boolean' ? visible : !current.visible;

      const update = await pool.query(
        'UPDATE services SET visible = $1 WHERE id = $2 RETURNING ' + SERVICE_COLS,
        [nextVisible, id]
      );
      res.json({
        success: true,
        message: nextVisible
          ? 'Service is now visible on the main page'
          : 'Service is now hidden from the main page',
        service: mapRow(update.rows[0]),
      });
    } catch (e) {
      console.error('PATCH /admin/services/:id/visibility', e);
      res.status(500).json({
        success: false,
        message: 'Failed to update visibility',
        error: e.message,
      });
    }
  });

  // PATCH /admin/services/:id — update a service
  router.patch('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        category,
        priceRange,
        imageUrl,
        description,
        visible,
        backgroundImageUrl,
        shortDescription,
        overview,
        overviewImageUrl,
        keyFeatures,
        benefits,
        whatYouGet,
      } = req.body ?? {};

      const find = await pool.query(`SELECT ${SERVICE_COLS} FROM services WHERE id = $1`, [id]);
      if (find.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Service not found',
        });
      }
      const row = find.rows[0];

      const titleVal = typeof title === 'string' && title.trim() ? title.trim() : row.title;
      const categoryVal = typeof category === 'string' ? (category.trim() || 'General') : row.category;
      const priceRangeVal = typeof priceRange === 'string' ? priceRange.trim() : row.price_range;
      const imageUrlVal = imageUrl !== undefined ? (imageUrl ? String(imageUrl).trim() : null) : row.image_url;
      const descriptionVal = description !== undefined ? (description ? String(description).trim() : null) : row.description;
      const visibleVal = typeof visible === 'boolean' ? visible : row.visible;
      const backgroundImageUrlVal = backgroundImageUrl !== undefined ? (backgroundImageUrl ? String(backgroundImageUrl).trim() : null) : row.background_image_url;
      const shortDescriptionVal = shortDescription !== undefined ? (shortDescription ? String(shortDescription).trim() : null) : row.short_description;
      const overviewVal = overview !== undefined ? (overview ? String(overview).trim() : null) : row.overview;
      const overviewImageUrlVal = overviewImageUrl !== undefined ? (overviewImageUrl ? String(overviewImageUrl).trim() : null) : row.overview_image_url;
      const keyFeaturesVal = keyFeatures !== undefined ? arrayToText(keyFeatures) : row.key_features;
      const benefitsVal = benefits !== undefined ? arrayToText(benefits) : row.benefits;
      const whatYouGetVal = whatYouGet !== undefined ? arrayToText(whatYouGet) : row.what_you_get;

      const result = await pool.query(
        `UPDATE services SET
          title = $1, category = $2, price_range = $3, image_url = $4, description = $5, visible = $6,
          background_image_url = $7, short_description = $8, overview = $9, overview_image_url = $10,
          key_features = $11, benefits = $12, what_you_get = $13
         WHERE id = $14 RETURNING ${SERVICE_COLS}`,
        [
          titleVal,
          categoryVal,
          priceRangeVal,
          imageUrlVal,
          descriptionVal,
          visibleVal,
          backgroundImageUrlVal,
          shortDescriptionVal,
          overviewVal,
          overviewImageUrlVal,
          keyFeaturesVal,
          benefitsVal,
          whatYouGetVal,
          id,
        ]
      );
      res.json({
        success: true,
        message: 'Service updated successfully',
        service: mapRow(result.rows[0]),
      });
    } catch (e) {
      console.error('PATCH /admin/services/:id', e);
      res.status(500).json({
        success: false,
        message: 'Failed to update service',
        error: e.message,
      });
    }
  });

  // DELETE /admin/services/:id — delete a service
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const find = await pool.query('SELECT id FROM services WHERE id = $1', [id]);
      if (find.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Service not found',
        });
      }
      await pool.query('DELETE FROM services WHERE id = $1', [id]);
      res.json({
        success: true,
        message: 'Service deleted successfully',
      });
    } catch (e) {
      console.error('DELETE /admin/services/:id', e);
      res.status(500).json({
        success: false,
        message: 'Failed to delete service',
        error: e.message,
      });
    }
  });

  return router;
}

/** Public route: GET / — visible services only, for landing page and service detail. */
function publicServices(pool) {
  const router = Router();
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT ${SERVICE_COLS} FROM services WHERE visible = true ORDER BY created_at DESC`
      );
      res.json(result.rows.map(mapRow));
    } catch (e) {
      console.error('GET /api/services', e);
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  });
  return router;
}

export { adminServices, publicServices };
