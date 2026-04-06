import { Router } from 'express';
import * as teamController from '../controllers/team.controller.js';
import * as teamMiddleware from '../middleware/team.middleware.js';
import { pool } from '../config/db.js';

const router = Router();

// GET /api/teams - List all members
router.get('/', teamController.getMembers);

// GET /api/teams/:id - Get specific member
router.get('/:id', teamController.getMember);

// POST /api/teams - Create member
router.post('/', teamMiddleware.validateTeamMember, teamController.createMember);

// PATCH /api/teams/:id/visibility - Toggle visibility (must come before /:id)
router.patch('/:id/visibility', async (req, res) => {
    try {
        const { id } = req.params;
        const { visible } = req.body ?? {};

        const find = await pool.query('SELECT * FROM team_members WHERE id = $1', [id]);
        if (find.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }
        const current = find.rows[0];
        const nextVisible = typeof visible === 'boolean' ? visible : !current.visible;

        const update = await pool.query(
            'UPDATE team_members SET visible = $1 WHERE id = $2 RETURNING *',
            [nextVisible, id]
        );
        const member = update.rows[0];
        res.json({
            success: true,
            message: nextVisible ? 'Member is now visible' : 'Member is now hidden',
            member,
        });
    } catch (err) {
        console.error('PATCH /api/teams/:id/visibility', err);
        res.status(500).json({ success: false, message: 'Failed to update visibility' });
    }
});

// PATCH /api/teams/:id - Update member
router.patch('/:id', teamMiddleware.validateTeamMemberUpdate, teamController.updateMember);

// DELETE /api/teams/:id - Delete member
router.delete('/:id', teamController.deleteMember);

export default router;
