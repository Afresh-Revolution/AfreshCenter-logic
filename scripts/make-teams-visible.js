import { pool } from '../src/config/db.js';

async function makeVisible() {
    try {
        console.log('Adding "visible" column to team_members...');
        await pool.query('ALTER TABLE team_members ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true;');
        
        console.log('Updating team members to be visible...');
        const res = await pool.query('UPDATE team_members SET visible = true RETURNING id;');
        console.log(`Successfully updated ${res.rowCount} team members to be visible.`);
    } catch (err) {
        console.error('Error updating team members:', err);
    } finally {
        await pool.end();
    }
}

makeVisible();
