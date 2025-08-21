import Link from "next/link";

type Campaign = {
  id: string;          // slug/identificador
  title: string;
  price: number;       // preço da raspadinha
  goal: number;        // meta de vendas
  sold: number;        // vendidas
  image?: string;      // opcional (usaremos um placeholder local)
};

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  const progress = Math.min(100, Math.round((campaign.sold / campaign.goal) * 100));

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="aspect-[16/9] w-full bg-gradient-to-br from-slate-100 to-slate-200">
        {/* usando imagem local para não precisar configurar domains */}
        <img
          src="/icons/icon-512.png"
          alt={campaign.title}
          className="h-full w-full object-contain p-6"
        />
      </div>

      <div className="space-y-3 p-4">
        <h3 className="line-clamp-2 text-lg font-semibold">{campaign.title}</h3>

        <div className="text-sm text-gray-600">
          R$ {campaign.price.toFixed(2)} <span className="text-gray-400">por raspadinha</span>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {campaign.sold} / {campaign.goal} raspadinhas
          </p>
        </div>

        <Link
          href={`/raspadinha/${campaign.id}`}
          className="block rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          Raspar agora
        </Link>
      </div>
    </div>
  );
}
