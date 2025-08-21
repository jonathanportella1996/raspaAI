'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  cover?: string;
  coverColor?: string;
  brushSize?: number;
  threshold?: number;
  onReveal?: () => void;
  className?: string;
  children?: React.ReactNode;
};

export default function ScratchCard({
  cover,
  coverColor = '#C9CDD1',
  brushSize = 28,
  threshold = 0.55,
  onReveal,
  className,
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [size, setSize] = useState({ w: 600, h: 330 });

  useEffect(() => {
    const resize = () => {
      const el = containerRef.current;
      if (!el) return;
      const w = el.clientWidth;
      const ratio = 330 / 600;
      setSize({ w, h: Math.round(w * ratio) });
    };
    resize();
    const ro = new ResizeObserver(resize);
    containerRef.current && ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = size.w;
    canvas.height = size.h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (cover) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = cover;
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      img.onerror = () => {
        ctx.fillStyle = coverColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };
    } else {
      ctx.fillStyle = coverColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [cover, coverColor, size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isDown = false;

    const getPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
    };

    const handleDown = (e: PointerEvent) => {
      isDown = true;
      canvas.setPointerCapture(e.pointerId);
      const { x, y } = getPos(e);
      scratch(x, y);
      maybeReveal();
    };
    const handleMove = (e: PointerEvent) => {
      if (!isDown) return;
      const { x, y } = getPos(e);
      scratch(x, y);
    };
    const handleUp = (e: PointerEvent) => {
      isDown = false;
      canvas.releasePointerCapture(e.pointerId);
      maybeReveal();
    };

    let lastCheck = 0;
    const maybeReveal = () => {
      const now = performance.now();
      if (now - lastCheck < 200) return;
      lastCheck = now;

      const { width, height } = canvas;
      const step = 4;
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      let transparent = 0;
      let total = 0;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const i = (y * width + x) * 4 + 3;
          total++;
          if (data[i] === 0) transparent++;
        }
      }
      const percent = transparent / total;
      if (percent >= threshold) {
        setRevealed(true);
        canvas.style.transition = 'opacity 300ms ease';
        canvas.style.opacity = '0';
        onReveal?.();
      }
    };

    canvas.addEventListener('pointerdown', handleDown);
    canvas.addEventListener('pointermove', handleMove);
    canvas.addEventListener('pointerup', handleUp);
    canvas.addEventListener('pointercancel', handleUp);
    return () => {
      canvas.removeEventListener('pointerdown', handleDown);
      canvas.removeEventListener('pointermove', handleMove);
      canvas.removeEventListener('pointerup', handleUp);
      canvas.removeEventListener('pointercancel', handleUp);
    };
  }, [brushSize, threshold, revealed, onReveal]);

  return (
    <div ref={containerRef} className={className ?? ''}>
      <div className="relative overflow-hidden rounded-2xl border border-border shadow-sm" style={{ width: '100%', height: size.h }}>
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-gradient-to-br from-white to-emerald-50">
          <div className="text-center space-y-1">
            {children ?? (
              <>
                <div className="text-xs text-muted-foreground">Cupom desbloqueado</div>
                <div className="text-3xl font-bold">RSPI-10OFF</div>
                <div className="text-xs text-muted-foreground">Válido por 48h • Pedidos acima de R$ 50</div>
              </>
            )}
          </div>
        </div>
        <canvas ref={canvasRef} className="absolute inset-0 touch-none" aria-label="Raspadinha" />
      </div>
    </div>
  );
}
