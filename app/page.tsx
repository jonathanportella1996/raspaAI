import Hero from '../components/Hero';
import CampaignCard from '../components/CampaignCard';

const mockCampaigns = [
  { slug: 'demo', title: 'Sorteio de Boas-vindas', availability: 'ALTA',  cover: '/demo/cover.jpg' },
  { slug: 'dia-do-cliente', title: 'Dia do Cliente', availability: 'MEDIA', cover: '/demo/cover2.jpg' },
  { slug: 'black-friday', title: 'Black Friday', availability: 'BAIXA', cover: '/demo/cover3.jpg' },
] as const;

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="pb-16">
        <header className="max-w-3xl">
          <h2 className="text-xl sm:text-2xl font-bold">Campanhas em destaque</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ative uma campanha em minutos e acompanhe conversão em tempo real.
          </p>
        </header>

        <div className="mt-6 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {mockCampaigns.map((c) => (
            <CampaignCard key={c.slug} {...c} />
          ))}
        </div>
      </section>
    </>
  );
}
