
"use client";
import React, { useEffect, useImperativeHandle, useRef, useState, forwardRef, useCallback } from "react";

type Props = {
  result: { isWinner: boolean; prizeLabel: string };
  onFinish?: () => void;
};

const ScratchCard = forwardRef<{ reset: () => void }, Props>(({ result, onFinish }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(0);

  const paintCover = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(rect.width));
    canvas.height = Math.max(1, Math.floor(rect.height));
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#c0c0c0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.25;
    for (let y = 0; y < canvas.height; y += 20) {
      for (let x = 0; x < canvas.width; x += 20) {
        if (((x + y) / 20) % 2 === 0) {
          ctx.fillStyle = "#9e9e9e";
          ctx.fillRect(x, y, 20, 20);
        }
      }
    }
    ctx.globalAlpha = 1;
    setProgress(0);
  }, []);

  useEffect(() => {
    paintCover();
    const onResize = () => paintCover();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [paintCover]);

  useEffect(() => {
    // ao mudar o result (nova compra), repinta
    paintCover();
  }, [result?.isWinner, result?.prizeLabel, paintCover]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let isDown = false;
    const getXY = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    };
    const calcProgress = () => {
      const step = 8; let cleared = 0, total = 0;
      const { width: w, height: h } = canvas;
      const data = ctx.getImageData(0, 0, w, h).data;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const a = data[((y * w + x) * 4) + 3];
          total++; if (a === 0) cleared++;
        }
      }
      const p = Math.round((cleared / total) * 100);
      setProgress(p);
      if (p >= 65) onFinish?.();
    };

    const onPointerDown = (e: PointerEvent) => { isDown = true; const {x,y} = getXY(e); scratch(x,y); };
    const onPointerMove = (e: PointerEvent) => { if(!isDown) return; const {x,y} = getXY(e); scratch(x,y); calcProgress(); };
    const onPointerUp = () => { isDown = false; calcProgress(); };
    const onPointerCancel = () => { isDown = false; };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerCancel);

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
    };
  }, [onFinish]);

  useImperativeHandle(ref, () => ({ reset: paintCover }), [paintCover]);

  return (
    <div className="relative bg-slate-800 rounded-2xl overflow-hidden h-64">
      <div className="absolute inset-0 flex items-center justify-center">
        {result?.isWinner ? (
          <div className="text-center">
            <div className="text-2xl font-bold">🎉 VOCÊ GANHOU!</div>
            <div className="opacity-80">{result.prizeLabel}</div>
          </div>
        ) : (
          <div className="text-center opacity-80">
            Raspe para revelar
          </div>
        )}
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs bg-black/60 px-2 py-1 rounded-full">
        {progress}%
      </div>
    </div>
  );
});
ScratchCard.displayName = "ScratchCard";
export default ScratchCard;
