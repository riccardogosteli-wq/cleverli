"use client";
import Image from "next/image";

interface Props {
  size?: number;
  mood?: "happy" | "thinking" | "celebrate";
}

export default function CleverliMascot({ size = 150, mood = "happy" }: Props) {
  const src = mood === "celebrate" ? "/cleverli-jump.png" : "/cleverli-wave.png";

  return (
    <div className="inline-block" style={{ width: size, height: size }}>
      <style>{`
        .cleverli-bounce {
          animation: cleverli-jump 2.5s ease-in-out infinite;
        }
        @keyframes cleverli-jump {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
      `}</style>
      <Image
        src={src}
        alt="Cleverli"
        width={size}
        height={size}
        className="cleverli-bounce object-contain drop-shadow-lg"
        priority
      />
    </div>
  );
}
