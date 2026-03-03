"use client";

interface ConfettiProps {
  active: boolean;
  duration?: number;
}

export default function Confetti({ active, duration = 3000 }: ConfettiProps) {
  if (!active) return null;

  const colors = ["#22c55e", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6", "#f97316"];
  const particles = Array.from({ length: 50 }, (_, i) => {
    const left = 5 + Math.random() * 90;
    const size = 8 + Math.random() * 4;
    const animDuration = 2 + Math.random() * 1.5;
    const animDelay = Math.random() * 0.6;
    const color = colors[i % colors.length];

    return (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${left}%`,
          top: "-20px",
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: color,
          borderRadius: "2px",
          animation: `confettiFall ${animDuration}s ease-in ${animDelay}s forwards`,
        }}
      />
    );
  });

  return (
    <>
      <style>{`
        @keyframes confettiFall {
          0% {
            top: -20px;
            opacity: 1;
          }
          100% {
            top: 110vh;
            opacity: 0;
            transform: rotate(720deg);
          }
        }
      `}</style>
      <div
        key={active ? "active" : "inactive"}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 50,
        }}
      >
        {particles}
      </div>
    </>
  );
}
