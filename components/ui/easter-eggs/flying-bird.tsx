'use client';

interface FlyingBirdProps {
  visible: boolean;
  position: { x: number; y: number };
  onClick: () => void;
}

export function FlyingBird({ visible, position, onClick }: FlyingBirdProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed pointer-events-auto z-50 cursor-pointer transition-transform hover:scale-110"
      style={{
        left: `${position.x}px`,
        top: `${position.y}%`,
        transform: 'translateY(-50%)',
      }}
      onClick={onClick}
      title="Catch the early bird!"
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-lg animate-pulse"
      >
        {/* Bird body */}
        <ellipse cx="32" cy="35" rx="18" ry="14" fill="#FFA500" />

        {/* Bird head */}
        <circle cx="28" cy="26" r="10" fill="#FFA500" />

        {/* Eye */}
        <circle cx="25" cy="24" r="2" fill="#000" />

        {/* Beak */}
        <path d="M18 26 L12 26 L18 28 Z" fill="#FF6B00" />

        {/* Wing (flapping) */}
        <path
          d="M32 30 Q45 20, 50 28 Q48 32, 38 35 Z"
          fill="#FF8C00"
          className="animate-flap"
        />

        {/* Tail */}
        <path d="M48 35 L55 32 L56 38 L52 40 Z" fill="#FF8C00" />

        {/* Sparkle effect */}
        <circle cx="42" cy="20" r="2" fill="#FFD700" opacity="0.8" className="animate-ping" />
      </svg>
    </div>
  );
}
