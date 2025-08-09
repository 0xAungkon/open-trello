import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { verifyPassword, generateToken, setAuthCookie } from "@/lib/auth"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user
    const users = await sql`
      SELECT id, name, email, password_hash 
      FROM users 
      WHERE email = ${email}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = users[0]

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate token and set cookie
    const token = await generateToken(user.id)
    await setAuthCookie(token)

    return NextResponse.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
