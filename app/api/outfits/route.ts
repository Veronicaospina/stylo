import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

function getUserId(req: Request) {
  return req.headers.get("x-user-id")
}

export async function GET(req: Request) {
  try {
    const userId = getUserId(req)
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const outfits = await prisma.outfit.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, createdAt: true },
    })
    return NextResponse.json(outfits)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const userId = getUserId(req)
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { name, itemIds } = await req.json()
    if (!name || !Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }
    const outfit = await prisma.outfit.create({
      data: {
        name,
        userId,
        items: { create: itemIds.map((itemId: string) => ({ item: { connect: { id: itemId } } })) },
      },
      include: { items: { include: { item: true } } },
    })
    return NextResponse.json(outfit)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
