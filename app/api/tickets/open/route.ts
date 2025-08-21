
import { NextResponse } from "next/server";
export async function POST() {
  // TODO: validar dono, status=paid, sortear server-side
  return NextResponse.json({ isWinner: false, prizeLabel: "—" });
}
