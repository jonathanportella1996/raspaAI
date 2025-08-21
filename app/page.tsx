
import Link from "next/link";
import CampaignCard from "../components/CampaignCard";

const mockCampaigns = [
  { id: "demo-1", title: "iPhone 15 Pro", cover_url: "", price_cents: 2500, sold_count: 12, goal_count: 100 },
  { id: "demo-2", title: "PlayStation 5", cover_url: "", price_cents: 1500, sold_count: 40, goal_count: 120 },
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Campanhas ativas</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        {mockCampaigns.map(c => (
          <CampaignCard key={c.id} item={c}>
            <Link href={`/raspadinha/${c.id}`} className="mt-3 inline-block bg-yellow-400 text-black font-semibold px-3 py-2 rounded-lg">
              Jogar
            </Link>
          </CampaignCard>
        ))}
      </div>
      <p className="text-sm opacity-70">⚠️ Dados mock. Depois conectaremos ao Supabase.</p>
    </div>
  );
}
