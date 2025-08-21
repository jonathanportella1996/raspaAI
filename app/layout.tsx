
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "RaspaBet",
  description: "Raspadinhas online",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="border-b border-slate-800">
          <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
            <Link href="/" className="font-bold">RaspaBet</Link>
            <div className="ml-auto flex items-center gap-3 text-sm">
              <Link href="/">Início</Link>
              <Link href="/minha-conta">Minha Conta</Link>
              <Link href="/admin">Painel</Link>
            </div>
          </nav>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
