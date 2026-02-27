import * as teamModel from '../models/team.model.js';

// Initialize DB on controller load
teamModel.initTeamDb().catch(err => console.error('Failed to init team DB:', err));

export const getMembers = async (req, res) => {
    try {
        const members = await teamModel.getAllMembers();
        res.json(members);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching team members' });
    }
};

export const getMember = async (req, res) => {
    try {
        const member = await teamModel.getMemberById(req.params.id);
        if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
        res.json(member);
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error fetching member' });
    }
};

export const createMember = async (req, res) => {
    try {
        const member = await teamModel.createMember(req.validated);
        res.status(201).json({ success: true, message: 'Member created successfully', member });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error creating member' });
    }
};

export const updateMember = async (req, res) => {
    try {
        const member = await teamModel.updateMemberById(req.params.id, req.validated);
        if (!member) return res.status(404).json({ success: false, message: 'Member not found' });
        res.json({ success: true, message: 'Member updated successfully', member });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error updating member' });
    }
};

export const deleteMember = async (req, res) => {
    try {
        const success = await teamModel.deleteMemberById(req.params.id);
        if (!success) return res.status(404).json({ success: false, message: 'Member not found' });
        res.json({ success: true, message: 'Member deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error deleting member' });
    }
};
