import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const userId = req.headers.get("x-user-id")
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const prismaClient = await getPrisma()
  const user = await prismaClient.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    return NextResponse.json({ id: user.id, email: user.email, name: user.name })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
