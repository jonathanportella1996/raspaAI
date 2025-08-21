// app/page.tsx
import NavBar from "../components/NavBar";
import Hero from "../components/Hero";
import CampaignCard from "../components/CampaignCard";
import Footer from "../components/Footer";

const campaigns = [
  { id: "iphone15", title: "iPhone 15 Pro 128GB", price: 25, goal: 1000, sold: 420 },
  { id: "ps5",      title: "PlayStation 5 Slim",  price: 20, goal: 800,  sold: 560 },
  { id: "airpods",  title: "AirPods Pro (2ª Geração)", price: 10, goal: 600, sold: 180 },
];

export default function Home() {
  return (
    <>
      <NavBar />
      <Hero />

      <main id="campanhas" className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Campanhas ativas</h2>
          <p className="text-sm text-gray-500">Escolha uma e boa sorte!</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
