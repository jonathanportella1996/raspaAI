'use client';

import ScratchCard from './ScratchCard';

export default function CampaignScratch({
  slug,
  texture,
  code,
  note,
}: {
  slug: string;
  texture?: string;
  code: string;
  note: string;
}) {
  const handleReveal = async () => {
    try {
      await fetch('/api/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      // aqui você pode disparar confete/toast, etc.
    } catch {}
  };

  return (
    <ScratchCard cover={texture} brushSize={30} threshold={0.55} onReveal={handleReveal}>
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">Cupom desbloqueado</div>
        <div className="text-3xl font-extrabold">{code}</div>
        <div className="text-sm text-muted-foreground">{note}</div>
      </div>
    </ScratchCard>
  );
}
