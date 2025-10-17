import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

  const prisma = await getPrisma()
  const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { email, name, password: hashed } })
    return NextResponse.json({ id: user.id, email: user.email, name: user.name })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
