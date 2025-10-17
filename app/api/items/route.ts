import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

function getUserId(req: Request) {
  const id = req.headers.get("x-user-id")
  return id || null
}

export async function GET(req: Request) {
  try {
    const userId = getUserId(req)
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const items = await prisma.item.findMany({ where: { userId }, orderBy: { createdAt: "desc" } })
    return NextResponse.json(items)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const userId = getUserId(req)
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const data = await req.json()
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const item = await prisma.item.create({ data: { ...data, userId } })
    return NextResponse.json(item)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = getUserId(req)
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { id } = await req.json()
    await prisma.item.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
