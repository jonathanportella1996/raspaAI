import './globals.css';
export const metadata = { title: 'RaspaAI' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body className="bg-gray-50 text-gray-900 antialiased">{children}</body></html>;
}
