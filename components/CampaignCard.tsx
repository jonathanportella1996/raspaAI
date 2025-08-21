'use client';

import Link from 'next/link';
import Image from 'next/image';

type Availability = 'ALTA' | 'MEDIA' | 'BAIXA';

export default function CampaignCard({
  slug,
  title,
  availability,
  cover,
}: {
  slug: string;
  title: string;
  availability: Availability;
  cover?: string;
}) {
  const color =
    availability === 'ALTA' ? 'bg-emerald-100 text-emerald-700' :
    availability === 'MEDIA' ? 'bg-amber-100 text-amber-700' :
    'bg-rose-100 text-rose-700';

  const label =
    availability === 'ALTA' ? 'Disponibilidade: Alta' :
    availability === 'MEDIA' ? 'Disponibilidade: Média' :
    'Disponibilidade: Baixa';

  return (
    <Link
      href={`/campaigns/${slug}`}
      className="group rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:-translate-y-0.5 transition flex flex-col"
      aria-label={`Abrir campanha ${title}`}
    >
      <div className="relative aspect-[16/9] bg-muted">
        {cover && (
          <Image
            src={cover}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          />
        )}
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <h3 className="font-semibold text-base sm:text-lg">{title}</h3>
        <div className="mt-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${color}`}>
            {label}
          </span>
        </div>
        <div className="mt-auto pt-4 text-sm text-muted-foreground">
          Clique e teste a raspadinha.
        </div>
      </div>
    </Link>
  );
}
