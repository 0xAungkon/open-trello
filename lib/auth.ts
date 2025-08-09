import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function generateToken(userId: string): Promise<string> {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return { userId: payload.userId as string }
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload) return null

  try {
    const users = await sql`
      SELECT id, email, name, avatar_url 
      FROM users 
      WHERE id = ${payload.userId}
    `
    return users[0] || null
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}
