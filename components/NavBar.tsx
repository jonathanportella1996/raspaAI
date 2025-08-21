import Link from "next/link";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">
          RaspaAI
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Início
          </Link>
          <Link
            href="/raspadinha/iphone15"
            className="rounded-md bg-blue-600 px-3 py-1.5 font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Jogar agora
          </Link>
        </nav>
      </div>
    </header>
  );
}
