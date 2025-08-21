
import { NextResponse } from "next/server";
export async function POST() {
  // TODO: integrar Mercado Pago (criar Preference)
  return NextResponse.json({ init_point: "https://mercadopago.exemplo" });
}
