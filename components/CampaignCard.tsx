
import ProgressBar from "./ProgressBar";

export default function CampaignCard({ item, children }: { item: any; children?: React.ReactNode }) {
  return (
    <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/40">
      <div className="h-32 rounded-lg bg-slate-800 mb-3 grid place-items-center text-slate-400">
        (imagem)
      </div>
      <div className="font-semibold">{item.title}</div>
      <div className="text-sm opacity-80">R$ {(item.price_cents/100).toFixed(2)}</div>
      <ProgressBar sold={item.sold_count} goal={item.goal_count} />
      {children}
    </div>
  );
}
