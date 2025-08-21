
import { NextResponse } from "next/server";
export async function POST() {
  // TODO: validar evento, criar tickets paid, atualizar sold_count
  return NextResponse.json({ ok: true });
}
