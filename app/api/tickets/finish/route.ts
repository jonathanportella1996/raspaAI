
import { NextResponse } from "next/server";
export async function POST() {
  // TODO: validar dono, status=opened, finalizar e registrar winner se ganhou
  return NextResponse.json({ ok: true });
}
