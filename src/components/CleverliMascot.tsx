"use client";

interface Props {
  size?: number;
  mood?: "happy" | "thinking" | "celebrate";
}

export default function CleverliMascot({ size = 150, mood = "happy" }: Props) {
  return (
    <div className="inline-block" style={{ width: size }}>
      <style>{`
        .cleverli-mascot {
          width: 100%;
          animation: cleverli-jump 2.5s ease-in-out infinite;
        }
        .cleverli-arm {
          transform-origin: 145px 95px;
          animation: cleverli-wave 1s ease-in-out infinite alternate;
        }
        @keyframes cleverli-jump {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-12px); }
        }
        @keyframes cleverli-wave {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(25deg); }
        }
      `}</style>
      <svg viewBox="0 0 200 220" className="cleverli-mascot">
        {/* Body */}
        <circle cx="100" cy="130" r="45" fill="#c68642"/>
        {/* Head */}
        <circle cx="100" cy="75" r="40" fill="#d89b55"/>
        {/* Eyes */}
        <circle cx="85" cy="70" r="6" fill="#1a1a1a"/>
        <circle cx="115" cy="70" r="6" fill="#1a1a1a"/>
        {/* Eye shine */}
        <circle cx="87" cy="68" r="2" fill="white"/>
        <circle cx="117" cy="68" r="2" fill="white"/>
        {/* Smile */}
        {mood === "happy" && (
          <path d="M85 90 Q100 105 115 90" stroke="#1a1a1a" strokeWidth="3" fill="transparent" strokeLinecap="round"/>
        )}
        {mood === "thinking" && (
          <path d="M88 95 Q100 92 112 95" stroke="#1a1a1a" strokeWidth="3" fill="transparent" strokeLinecap="round"/>
        )}
        {/* Hat - red Swiss cap */}
        <path d="M65 50 Q100 20 135 50 Z" fill="#e53935"/>
        <polygon points="100,30 83,50 117,50" fill="white"/>
        {/* Hat mountain detail */}
        <polygon points="100,36 93,46 107,46" fill="#e53935"/>
        {/* Waving arm */}
        <g className="cleverli-arm">
          <ellipse cx="145" cy="120" rx="15" ry="30" fill="#c68642"/>
        </g>
        {/* Left arm */}
        <ellipse cx="55" cy="120" rx="15" ry="25" fill="#c68642"/>
      </svg>
    </div>
  );
}
