'use client';

import { useState } from 'react';

interface SecretHoverZoneProps {
  onHoverEnter: () => void;
  onHoverLeave: () => void;
}

export function SecretHoverZone({ onHoverEnter, onHoverLeave }: SecretHoverZoneProps) {
  const [hoverProgress, setHoverProgress] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    onHoverEnter();

    // Animate progress bar
    let progress = 0;
    const interval = setInterval(() => {
      progress += 3.33; // 100 / 30 frames for 3 seconds
      setHoverProgress(Math.min(progress, 100));

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setHoverProgress(0);
    onHoverLeave();
  };

  return (
    <div
      className="fixed top-0 right-0 w-16 h-16 cursor-pointer group z-40"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title="Mysterious corner..."
    >
      {/* Subtle hint - only visible on hover */}
      <div className="absolute inset-0 bg-linear-to-bl from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Progress indicator when hovering */}
      {isHovering && (
        <div className="absolute bottom-2 right-2 w-12 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-orange-400 to-green-500 transition-all duration-100"
            style={{ width: `${hoverProgress}%` }}
          />
        </div>
      )}

      {/* Bird silhouette appears on hover */}
      {isHovering && (
        <div className="absolute top-2 right-2 opacity-30 animate-pulse">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-orange-500">
            <path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-8 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm16 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-8 3c-3.31 0-6 2.69-6 6v4h12v-4c0-3.31-2.69-6-6-6z" />
          </svg>
        </div>
      )}
    </div>
  );
}
