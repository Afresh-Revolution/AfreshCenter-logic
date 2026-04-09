import { pool } from '../src/config/db.js';

async function migrateImages() {
    console.log('Starting image migration...');
    try {
        console.log('Migrating services table...');
        const serviceRes = await pool.query(`UPDATE services SET image = NULL WHERE image LIKE '/uploads/%' RETURNING id;`);
        console.log(`Updated ${serviceRes.rowCount} services.`);

        console.log('Migrating team_members table...');
        const teamRes = await pool.query(`UPDATE team_members SET image_url = NULL WHERE image_url LIKE '/uploads/%' RETURNING id;`);
        console.log(`Updated ${teamRes.rowCount} team members.`);

        console.log('Migration completed successfully.');
    } catch (err) {
        console.error('Error during migration:', err);
    } finally {
        // Close the pool so script exits
        await pool.end();
    }
}

migrateImages();
