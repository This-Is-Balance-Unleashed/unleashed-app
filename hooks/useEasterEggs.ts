'use client';

import { useEffect, useState, useCallback } from 'react';

interface UseEasterEggsOptions {
  onEasterEggFound: () => void;
}

export function useEasterEggs({ onEasterEggFound }: UseEasterEggsOptions) {
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [showBird, setShowBird] = useState(false);
  const [birdPosition, setBirdPosition] = useState({ x: -100, y: 50 });
  const [isEarlyBirdTime, setIsEarlyBirdTime] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);
  const [keyTimer, setKeyTimer] = useState<NodeJS.Timeout | null>(null);

  // Easter Egg 1: Time-based (5-7 AM)
  useEffect(() => {
    const checkEarlyBirdTime = () => {
      const now = new Date();
      const hour = now.getHours();
      const isEarly = hour >= 5 && hour < 7;

      if (isEarly && !isEarlyBirdTime) {
        setIsEarlyBirdTime(true);
        onEasterEggFound();
      } else {
        setIsEarlyBirdTime(isEarly);
      }
    };

    checkEarlyBirdTime();
    const interval = setInterval(checkEarlyBirdTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isEarlyBirdTime, onEasterEggFound]);

  // Easter Egg 2: Type "EARLYBIRD"
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Clear existing timer
      if (keyTimer) {
        clearTimeout(keyTimer);
      }

      const key = e.key.toUpperCase();
      const newSequence = [...keySequence, key].slice(-9); // Keep last 9 characters

      // Prevent browser's Quick Find if we're building the sequence
      const targetSequence = 'EARLYBIRD';
      const currentString = newSequence.join('');

      // Check if current sequence matches the beginning of our target
      if (targetSequence.startsWith(currentString) && currentString.length > 0) {
        e.preventDefault(); // Prevent browser search
        setKeySequence(newSequence);

        // Set timeout to reset sequence if user pauses (2 seconds)
        const timer = setTimeout(() => {
          setKeySequence([]);
        }, 2000);
        setKeyTimer(timer);
      } else {
        setKeySequence(newSequence);
      }

      if (currentString === targetSequence) {
        e.preventDefault();
        onEasterEggFound();
        setKeySequence([]); // Reset
        if (keyTimer) clearTimeout(keyTimer);
        // Show bird chirp animation
        setShowBird(true);
        setTimeout(() => setShowBird(false), 2000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (keyTimer) clearTimeout(keyTimer);
    };
  }, [keySequence, keyTimer, onEasterEggFound]);

  // Easter Egg 3: Flying bird animation
  useEffect(() => {
    const flyBird = () => {
      const startY = Math.random() * 60 + 20; // Random Y between 20-80%
      setBirdPosition({ x: -100, y: startY });
      setShowBird(true);

      // Animate bird across screen
      const duration = 8000 + Math.random() * 4000; // 8-12 seconds
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
          setBirdPosition({
            x: -100 + progress * (window.innerWidth + 200),
            y: startY + Math.sin(progress * 4) * 10, // Gentle wave motion
          });
          requestAnimationFrame(animate);
        } else {
          setShowBird(false);
        }
      };

      requestAnimationFrame(animate);
    };

    // Show bird every 2-3 minutes
    const showInterval = setInterval(() => {
      flyBird();
    }, 120000 + Math.random() * 60000);

    // Show first bird after 30 seconds
    const initialTimeout = setTimeout(flyBird, 30000);

    return () => {
      clearInterval(showInterval);
      clearTimeout(initialTimeout);
    };
  }, []);

  // Easter Egg 7: Hover secret zone (top-right corner)
  const handleSecretZoneEnter = useCallback(() => {
    const timer = setTimeout(() => {
      onEasterEggFound();
    }, 3000); // 3 seconds hover

    setHoverTimer(timer);
  }, [onEasterEggFound]);

  const handleSecretZoneLeave = useCallback(() => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  }, [hoverTimer]);

  // Easter Egg 8: Shift + Alt + Click handler
  const handleShiftAltClick = useCallback((e: React.MouseEvent) => {
    if (e.shiftKey && e.altKey) {
      e.preventDefault();
      onEasterEggFound();
    }
  }, [onEasterEggFound]);

  return {
    showBird,
    birdPosition,
    isEarlyBirdTime,
    handleSecretZoneEnter,
    handleSecretZoneLeave,
    handleShiftAltClick,
  };
}
