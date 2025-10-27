import pool from './db';

export async function runMigrations() {
  try {
    // Check if bannerImageUrl column exists
    const checkColumnQuery = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'courses' AND column_name = 'bannerimageurl'
    `;
    
    const columnCheck = await pool.query(checkColumnQuery);
    
    if (columnCheck.rows.length === 0) {
      // Add bannerImageUrl column if it doesn't exist
      console.log('Adding bannerImageUrl column to courses table...');
      await pool.query(`
        ALTER TABLE courses 
        ADD COLUMN bannerImageUrl varchar DEFAULT ''
      `);
      console.log('bannerImageUrl column added successfully');
    } else {
      console.log('bannerImageUrl column already exists');
    }

    // Update existing courses to have empty bannerImageUrl if they don't have it
    const updateQuery = `
      UPDATE courses 
      SET bannerImageUrl = '' 
      WHERE bannerImageUrl IS NULL
    `;
    
    const updateResult = await pool.query(updateQuery);
    console.log(`Updated ${updateResult.rowCount} existing courses with empty bannerImageUrl`);

  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migrations completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
} 