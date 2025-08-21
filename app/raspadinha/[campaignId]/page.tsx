
"use client";
import { useRef, useState } from "react";
import ScratchCard from "@/components/ScratchCard";

export default function CampaignPlayPage({ params }: { params: { campaignId: string } }) {
  const cardRef = useRef<{ reset: () => void } | null>(null);
  const [lastResult, setLastResult] = useState<{isWinner:boolean; prizeLabel:string} | null>(null);

  const buyAndStart = async () => {
    // FUTURO: redirecionar para Mercado Pago e aguardar webhook criar ticket "paid"
    // Por enquanto: simula resultado
    const isWinner = Math.random() < 0.25;
    const prizeLabel = isWinner ? "Cupom R$ 50" : "—";
    setLastResult({ isWinner, prizeLabel });
    cardRef.current?.reset();
  };

  const onFinish = () => {
    // FUTURO: chamar /api/tickets/finish
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Campanha: {params.campaignId}</h1>
      <button onClick={buyAndStart} className="bg-yellow-400 text-black font-semibold px-3 py-2 rounded-lg">
        Comprar Raspadinha (demo)
      </button>
      <ScratchCard ref={cardRef as any} result={lastResult ?? {isWinner:false, prizeLabel:"—"}} onFinish={onFinish} />
    </div>
  );
}
