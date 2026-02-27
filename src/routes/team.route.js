import { Router } from 'express';
import * as teamController from '../controllers/team.controller.js';
import * as teamMiddleware from '../middleware/team.middleware.js';

const router = Router();

// GET /api/teams - List all members
router.get('/', teamController.getMembers);

// GET /api/teams/:id - Get specific member
router.get('/:id', teamController.getMember);

// POST /api/teams - Create member
router.post('/', teamMiddleware.validateTeamMember, teamController.createMember);

// PATCH /api/teams/:id - Update member
router.patch('/:id', teamMiddleware.validateTeamMemberUpdate, teamController.updateMember);

// DELETE /api/teams/:id - Delete member
router.delete('/:id', teamController.deleteMember);

export default router;
