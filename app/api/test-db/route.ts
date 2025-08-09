import { NextResponse } from "next/server"
import { testDatabaseConnection, checkTables } from "@/lib/test-connection"

export async function GET() {
  try {
    const connectionSuccess = await testDatabaseConnection()
    const tables = await checkTables()

    return NextResponse.json({
      success: connectionSuccess,
      tables: tables.map((t) => t.table_name),
      message: connectionSuccess ? "Database connection successful!" : "Database connection failed",
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Database test failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
