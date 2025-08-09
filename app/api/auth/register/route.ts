import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password and create user
    const passwordHash = await hashPassword(password)

    const users = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${passwordHash})
      RETURNING id, name, email
    `

    const user = users[0]
    const token = await generateToken(user.id)

    // Set auth cookie
    await setAuthCookie(token)

    return NextResponse.json({
      message: "User created successfully",
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
