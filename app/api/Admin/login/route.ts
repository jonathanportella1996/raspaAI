export async function POST(req: Request) {
  const { password } = await req.json();

  if (password === process.env.ADMIN_DASH_PASSWORD) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ ok: false, error: "Invalid password" }), { status: 401 });
}
