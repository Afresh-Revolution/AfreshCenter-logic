import { pool } from '../config/db.js';

export const initTeamDb = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS team_members (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                role TEXT NOT NULL,
                bio TEXT,
                image_url TEXT,
                visible BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
    } catch (err) {
        console.error('Error initializing team DB:', err);
        throw err;
    }
};

export const getAllMembers = async () => {
    const { rows } = await pool.query('SELECT * FROM team_members ORDER BY created_at ASC');
    return rows;
};

export const getMemberById = async (id) => {
    const { rows } = await pool.query('SELECT * FROM team_members WHERE id = $1', [id]);
    return rows[0];
};

export const createMember = async (data) => {
    const { name, role, bio, image_url, visible } = data;
    const query = `
        INSERT INTO team_members (name, role, bio, image_url, visible)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;
    const values = [name, role, bio || null, image_url || null, visible !== false];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const updateMemberById = async (id, data) => {
    const { name, role, bio, image_url, visible } = data;
    const query = `
        UPDATE team_members
        SET name = COALESCE($1, name),
            role = COALESCE($2, role),
            bio = COALESCE($3, bio),
            image_url = COALESCE($4, image_url),
            visible = COALESCE($5, visible)
        WHERE id = $6
        RETURNING *`;
    const values = [name, role, bio, image_url, visible, id];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const deleteMemberById = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM team_members WHERE id = $1', [id]);
    return rowCount > 0;
};
