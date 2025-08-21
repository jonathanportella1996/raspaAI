
export default function ProgressBar({ sold, goal }: { sold: number; goal: number }) {
  const pct = Math.min(100, Math.round((sold / Math.max(1, goal)) * 100));
  return (
    <div className="mt-2">
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-yellow-400" style={{ width: pct + '%' }} />
      </div>
      <div className="text-xs mt-1 opacity-70">{sold} de {goal}</div>
    </div>
  );
}
