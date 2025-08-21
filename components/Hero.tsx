import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-3xl font-extrabold md:text-5xl">
          Raspe e concorra a <span className="underline decoration-yellow-300">prêmios reais</span>!
        </h1>
        <p className="mt-4 max-w-2xl text-white/90 md:text-lg">
          Cada raspadinha te aproxima do prêmio principal. Convide amigos, some pontos e boa sorte! ✨
        </p>

        <div className="mt-8 flex gap-3">
          <Link
            href="/raspadinha/iphone15"
            className="rounded-lg bg-yellow-400 px-5 py-3 font-semibold text-gray-900 hover:bg-yellow-300 transition-colors"
          >
            Começar agora
          </Link>
          <Link
            href="#campanhas"
            className="rounded-lg bg-white/15 px-5 py-3 font-semibold hover:bg-white/25 transition-colors"
          >
            Ver campanhas
          </Link>
        </div>
      </div>
    </section>
  );
}
