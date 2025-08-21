// app/campaigns/[slug]/page.tsx
import CampaignScratch from '../../../components/CampaignScratch';
// Se quiser imagem de capa e ela existir:
// import Image from 'next/image';

export default function CampaignScratchPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  const campaign = {
    title: slug === 'demo' ? 'Demo RaspaAI' : 'Campanha Especial',
    // hero: '/demo/cover-scratch.jpg',         // use se existir em /public
    texture: '/scratch/foil.png',               // use se existir em /public
    prize: { code: 'RSPI-10OFF', note: 'Válido por 48h • Pedidos acima de R$ 50' },
  };

  return (
    <main className="px-4 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold">{campaign.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Raspe a área cinza para revelar seu prêmio. 🎟️</p>

      <div className="mt-6 max-w-xl">
        <CampaignScratch
          slug={slug}
          texture={campaign.texture}     // remova se não tiver a imagem em /public
          code={campaign.prize.code}
          note={campaign.prize.note}
        />
        <p className="mt-3 text-xs text-muted-foreground">* Termos se aplicam.</p>
      </div>

      {/* Ative se tiver a imagem:
      <div className="mt-8 relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted">
        <Image src={campaign.hero} alt="Capa" fill className="object-cover" />
      </div>
      */}
    </main>
  );
}
