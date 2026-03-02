"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

interface Props { correct: boolean; onContinue: () => void; label?: string; isTopicComplete?: boolean; }

/* Confetti particle */
interface Particle { x: number; y: number; vx: number; vy: number; color: string; size: number; angle: number; spin: number; life: number; }

const COLORS = ["#22c55e","#f59e0b","#3b82f6","#ec4899","#f97316","#8b5cf6","#06b6d4","#fbbf24"];

export default function RewardAnimation({ correct, onContinue, label, isTopicComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if ((!correct && !isTopicComplete) || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use getBoundingClientRect for reliable sizing after layout
    const rect = canvas.getBoundingClientRect();
    const W = rect.width || canvas.parentElement?.offsetWidth || 300;
    const H = rect.height || canvas.parentElement?.offsetHeight || 200;
    canvas.width = W; canvas.height = H;

    const count = isTopicComplete ? 120 : 50;
    particlesRef.current = Array.from({ length: count }, () => ({
      x: W / 2 + (Math.random() - 0.5) * W * 0.5,
      y: -10,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 4 + 3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 5,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.3,
      life: 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      for (const p of particlesRef.current) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.angle += p.spin; p.life -= 0.012;
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (particlesRef.current.length > 0) rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [correct, isTopicComplete]);

  return (
    <div className={`relative rounded-2xl p-6 text-center overflow-hidden
      ${isTopicComplete ? "bg-gradient-to-br from-green-50 to-yellow-50 border-2 border-green-300" :
        correct ? "bg-green-50 border-2 border-green-200" : "bg-orange-50 border-2 border-orange-200"}`}>

      {/* Confetti canvas */}
      {(correct || isTopicComplete) && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      )}

      <div className="relative z-10 flex flex-col items-center gap-3">
        {isTopicComplete ? (
          <>
            <div style={{ animation: "popIn 0.4s cubic-bezier(.34,1.56,.64,1)" }}>
              <Image src="/cleverli-jump-star.png" alt="Cleverli feiert!" width={120} height={120} className="drop-shadow-xl" />
            </div>
            <h2 className="text-2xl font-extrabold text-green-700">Thema geschafft! 🏆</h2>
            <p className="text-gray-500 text-sm">Du hast alle Aufgaben gelöst!</p>
          </>
        ) : correct ? (
          <>
            <div style={{ animation: "popIn 0.4s cubic-bezier(.34,1.56,.64,1)" }}>
              <Image src="/cleverli-celebrate.png" alt="Richtig!" width={90} height={90} className="drop-shadow-lg" />
            </div>
            <p className="text-xl font-bold text-green-700">Richtig! 🎉</p>
            {label && <p className="text-sm text-gray-500">{label}</p>}
          </>
        ) : (
          <>
            <div style={{ animation: "popIn 0.3s ease" }}>
              <Image src="/cleverli-think.png" alt="Fast!" width={80} height={80} className="drop-shadow-md" />
            </div>
            <p className="text-xl font-bold text-orange-600">Fast! Versuch nochmal 💪</p>
            {label && <p className="text-sm text-gray-500">{label}</p>}
          </>
        )}

        <button onClick={onContinue}
          style={{ animation: "popIn 0.4s 0.2s cubic-bezier(.34,1.56,.64,1) both" }}
          className={`mt-2 px-8 py-3 rounded-full font-bold text-white transition-all hover:scale-105 shadow-md
            ${isTopicComplete ? "bg-green-600 hover:bg-green-700 text-lg" : correct ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600"}`}>
          {isTopicComplete ? "🎮 Weiter üben" : correct ? "Weiter →" : "Nochmal →"}
        </button>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
