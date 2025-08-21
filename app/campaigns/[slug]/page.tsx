import { notFound } from 'next/navigation';
import Image from 'next/image';
import ScratchCard from '../../../components/ScratchCard'; // <- caminho relativo

export default function CampaignScratchPage({ params }: { params: { slug?: string } }) {
  const slug = params.slug;
  if (!slug) return notFound();

  const campaign = {
    title: slug === 'demo' ? 'Demo RaspaAI' : 'Campanha Especial',
    hero: '/demo/cover-scratch.jpg',
    texture: '/scratch/foil.png',
    prize: { code: 'RSPI-10OFF', note: 'Válido por 48h • Pedidos acima de R$ 50' },
  };

  const handleReveal = async () => {
    try { await fetch('/api/reveal', { method: 'POST', body: JSON.stringify({ slug }) }); } catch {}
  };

  return (
    <main className="px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2 items-start">
        <div className="order-2 lg:order-1 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-bold">{campaign.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Raspe a área cinza para revelar seu prêmio. 🎟️
          </p>
          <div className="mt-6">
            <ScratchCard cover={campaign.texture} brushSize={30} threshold={0.55} onReveal={handleReveal}>
              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">Cupom desbloqueado</div>
                <div className="text-3xl font-extrabold">{campaign.prize.code}</div>
                <div className="text-sm text-muted-foreground">{campaign.prize.note}</div>
              </div>
            </ScratchCard>
            <p className="mt-3 text-xs text-muted-foreground">* Termos se aplicam.</p>
          </div>
        </div>

        <div className="order-1 lg:order-2 relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted">
          <Image src={campaign.hero} alt="Capa" fill className="object-cover" />
        </div>
      </div>
    </main>
  );
}
