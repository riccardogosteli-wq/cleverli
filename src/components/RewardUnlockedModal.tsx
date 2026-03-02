"use client";
import { useEffect, useRef } from "react";
import { Reward } from "@/lib/rewards";

interface Props {
  reward: Reward;
  onClose: () => void;
}

export default function RewardUnlockedModal({ reward, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Simple confetti burst using canvas
  useEffect(() => {
    const canvas = document.getElementById("reward-confetti") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: -20,
      r: Math.random() * 6 + 4,
      color: ["#fbbf24","#34d399","#60a5fa","#f472b6","#a78bfa"][Math.floor(Math.random()*5)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * 0.4 - 0.2,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 6,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
        ctx.restore();
        p.y += p.speed;
        p.x += Math.sin(p.angle + p.y * 0.02) * 2;
        p.rotation += p.rotSpeed;
      });
      if (particles.some(p => p.y < canvas.height)) raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  // Close on backdrop click
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <canvas id="reward-confetti" className="fixed inset-0 pointer-events-none z-40" />

      <div ref={ref}
        className="relative z-50 bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-4 border-yellow-300 animate-bounce-in">

        {/* Big emoji */}
        <div className="text-8xl mb-4 animate-wiggle">{reward.emoji}</div>

        {/* Celebration text */}
        <div className="text-2xl font-black text-gray-800 mb-2">
          🎉 Geschafft!
        </div>
        <div className="text-xl font-bold text-green-700 mb-4">{reward.title}</div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <div className="text-3xl mb-2">📱</div>
          <div className="font-bold text-amber-800 text-sm">Zeig das Mama oder Papa!</div>
          <div className="text-amber-600 text-xs mt-1">
            Du hast dein Ziel erreicht — sie werden so stolz sein! 🥰
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white font-bold py-4 rounded-2xl text-lg transition-all shadow-lg">
          Weiter lernen! 🚀
        </button>
      </div>

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes wiggle {
          0%,100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out forwards; }
        .animate-wiggle { animation: wiggle 0.7s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
