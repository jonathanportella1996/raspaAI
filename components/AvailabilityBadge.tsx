export default function AvailabilityBadge({ level }: { level: 'ALTA'|'MEDIA'|'BAIXA' }) {
  const cls =
    level === 'ALTA' ? 'bg-emerald-100 text-emerald-700' :
    level === 'MEDIA' ? 'bg-amber-100 text-amber-700' :
    'bg-rose-100 text-rose-700';
  const label =
    level === 'ALTA' ? 'Disponibilidade: Alta' :
    level === 'MEDIA' ? 'Disponibilidade: Média' :
    'Disponibilidade: Baixa';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      {label}
    </span>
  );
}
