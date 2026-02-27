import { Router } from 'express';

/**
 * adminServices routes using Postgres.
 *
 * Assumptions about your schema (adjust if your column names differ):
 * - Table: services
 * - Columns:
 *   id (uuid or text PK),
 *   title (text),
 *   category (text),
 *   price_range (text),
 *   total_bookings (integer),
 *   visible (boolean),
 *   created_at (timestamp) — used for ordering.
 */
function adminServices(pool) {
  const router = Router();

  // GET /admin/services — list all services (for admin dashboard)
  router.get('/', async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT id, title, category, price_range, total_bookings, visible FROM services ORDER BY created_at DESC'
      );
      const services = result.rows.map((s) => ({
        id: String(s.id),
        title: s.title,
        category: s.category,
        priceRange: s.price_range,
        totalBookings: Number(s.total_bookings ?? 0),
        status: s.visible ? 'Active' : 'Inactive',
        visible: !!s.visible,
      }));
      res.json(services);
    } catch (e) {
      console.error('GET /admin/services', e);
      res.status(500).json({ error: 'Failed to fetch services' });
    }
  });

  // POST /admin/services — create a new service
  router.post('/', async (req, res) => {
    try {
      const { title, category, priceRange, visible } = req.body || {};
      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Title is required',
          errors: [{ field: 'title', message: 'Title is required' }],
        });
      }

      const text =
        'INSERT INTO services (title, category, price_range, total_bookings, visible) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, category, price_range, total_bookings, visible';
      const values = [
        String(title).trim(),
        String(category ?? 'General').trim(),
        String(priceRange ?? '').trim(),
        0,
        visible !== false,
      ];
      const result = await pool.query(text, values);
      const s = result.rows[0];

      res.status(201).json({
        success: true,
        message: 'Service created successfully',
        service: {
          id: String(s.id),
          title: s.title,
          category: s.category,
          priceRange: s.price_range,
          totalBookings: Number(s.total_bookings ?? 0),
          status: s.visible ? 'Active' : 'Inactive',
          visible: !!s.visible,
        },
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

      const find = await pool.query(
        'SELECT id, title, category, price_range, total_bookings, visible FROM services WHERE id = $1',
        [id]
      );
      if (find.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Service not found',
        });
      }
      const current = find.rows[0];
      const nextVisible = typeof visible === 'boolean' ? visible : !current.visible;

      const update = await pool.query(
        'UPDATE services SET visible = $1 WHERE id = $2 RETURNING id, title, category, price_range, total_bookings, visible',
        [nextVisible, id]
      );
      const s = update.rows[0];

      res.json({
        success: true,
        message: s.visible
          ? 'Service is now visible on the main page'
          : 'Service is now hidden from the main page',
        service: {
          id: String(s.id),
          title: s.title,
          category: s.category,
          priceRange: s.price_range,
          totalBookings: Number(s.total_bookings ?? 0),
          status: s.visible ? 'Active' : 'Inactive',
          visible: !!s.visible,
        },
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
      const { title, category, priceRange, visible } = req.body ?? {};

      const find = await pool.query(
        'SELECT id, title, category, price_range, total_bookings, visible FROM services WHERE id = $1',
        [id]
      );
      if (find.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Service not found',
        });
      }

      const titleVal = typeof title === 'string' && title.trim() ? title.trim() : find.rows[0].title;
      const categoryVal = typeof category === 'string' ? (category.trim() || 'General') : find.rows[0].category;
      const priceRangeVal = typeof priceRange === 'string' ? priceRange.trim() : find.rows[0].price_range;
      const visibleVal = typeof visible === 'boolean' ? visible : find.rows[0].visible;

      const result = await pool.query(
        `UPDATE services SET title = $1, category = $2, price_range = $3, visible = $4
         WHERE id = $5 RETURNING id, title, category, price_range, total_bookings, visible`,
        [titleVal, categoryVal, priceRangeVal, visibleVal, id]
      );
      const s = result.rows[0];

      res.json({
        success: true,
        message: 'Service updated successfully',
        service: {
          id: String(s.id),
          title: s.title,
          category: s.category,
          priceRange: s.price_range,
          totalBookings: Number(s.total_bookings ?? 0),
          status: s.visible ? 'Active' : 'Inactive',
          visible: !!s.visible,
        },
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

export { adminServices };
