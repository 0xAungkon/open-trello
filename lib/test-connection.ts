import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_NEON_DATABASE_URL!)

export async function testDatabaseConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time, version() as postgres_version`
    console.log("✅ Database connection successful!")
    console.log("Current time:", result[0].current_time)
    console.log("PostgreSQL version:", result[0].postgres_version)
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

export async function checkTables() {
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `
    console.log(
      "📋 Available tables:",
      tables.map((t) => t.table_name),
    )
    return tables
  } catch (error) {
    console.error("❌ Error checking tables:", error)
    return []
  }
}
