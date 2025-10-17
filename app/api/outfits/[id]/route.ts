import { NextResponse } from "next/server"
import { getPrisma } from "@/lib/db"

function getUserId(req: Request) {
  return req.headers.get("x-user-id")
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId(req)
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const prismaClient = await getPrisma()
  const outfit = await prismaClient.outfit.findFirst({
      where: { id: params.id, userId },
      include: { items: { include: { item: true } } },
    })
    if (!outfit) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(outfit)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = getUserId(req)
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // Ensure the outfit belongs to the user
  const prismaClient = await getPrisma()
  const existing = await prismaClient.outfit.findFirst({ where: { id: params.id, userId }, select: { id: true } })
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Remove junction rows before deleting outfit to avoid FK constraint issues
  await prismaClient.outfitItem.deleteMany({ where: { outfitId: params.id } })
  await prismaClient.outfit.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Internal error" }, { status: 500 })
  }
}
