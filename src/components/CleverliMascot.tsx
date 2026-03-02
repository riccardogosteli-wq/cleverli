"use client";
import Image from "next/image";

type Mood = "happy" | "thinking" | "celebrate" | "wave" | "run" | "sit-read";

const MOOD_SRC: Record<Mood, string> = {
  happy:      "/cleverli-wave.png",
  wave:       "/cleverli-wave.png",
  thinking:   "/cleverli-think.png",
  celebrate:  "/cleverli-celebrate.png",
  run:        "/cleverli-run.png",
  "sit-read": "/cleverli-sit-read.png",
};

interface Props {
  size?: number;
  mood?: Mood;
  animate?: boolean;
}

export default function CleverliMascot({ size = 150, mood = "happy", animate = true }: Props) {
  const src = MOOD_SRC[mood] ?? "/cleverli-wave.png";
  const bounce = animate && (mood === "happy" || mood === "wave" || mood === "celebrate");

  return (
    <div className="inline-block" style={{ width: size, height: size }}>
      {bounce && (
        <style>{`
          @keyframes cleverli-bounce {
            0%, 100% { transform: translateY(0); }
            50%       { transform: translateY(-10px); }
          }
        `}</style>
      )}
      <Image
        src={src}
        alt="Cleverli"
        width={size}
        height={size}
        style={bounce ? { animation: "cleverli-bounce 2.5s ease-in-out infinite" } : undefined}
        className="object-contain drop-shadow-lg"
        priority
      />
    </div>
  );
}
