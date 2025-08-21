import Image from 'next/image';
import CampaignScratch from '../../../components/CampaignScratch';

export default function CampaignScratchPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;


  const campaign = {
    title: slug === 'demo' ? 'Demo RaspaAI' : 'Campanha Especial',
    hero: '/demo/cover-scratch.jpg',     // comente se não tiver no /public
    texture: '/scratch/foil.png',        // comente se não tiver no /public
    prize: { code: 'RSPI-10OFF', note: 'Válido por 48h • Pedidos acima de R$ 50' },
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
            <CampaignScratch
              slug={slug}
              texture={campaign.texture}  // remova se a imagem não existir
              code={campaign.prize.code}
              note={campaign.prize.note}
            />
            <p className="mt-3 text-xs text-muted-foreground">* Termos se aplicam.</p>
          </div>
        </div>

        {/* Remova este bloco se a imagem não existir em /public/demo/cover-scratch.jpg */}
        <div className="order-1 lg:order-2 relative aspect-[16/10] rounded-2xl overflow-hidden bg-muted">
          <Image src={campaign.hero} alt="Capa" fill className="object-cover" />
        </div>
      </div>
    </main>
  );
}
