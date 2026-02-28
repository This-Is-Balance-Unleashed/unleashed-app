'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface UseEasterEggsOptions {
  onEasterEggFound: () => void;
}

export function useEasterEggs({ onEasterEggFound }: UseEasterEggsOptions) {
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [showBird, setShowBird] = useState(false);
  const [birdPosition, setBirdPosition] = useState({ x: -100, y: 50 });
  const [isEarlyBirdTime, setIsEarlyBirdTime] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<NodeJS.Timeout | null>(null);

  // Use ref to track if early bird was triggered (prevents infinite loops)
  const earlyBirdTriggeredRef = useRef(false);
  // Use ref for the callback to avoid dependency issues
  const onEasterEggFoundRef = useRef(onEasterEggFound);
  onEasterEggFoundRef.current = onEasterEggFound;

  // Easter Egg 1: Time-based (5-7 AM)
  useEffect(() => {
    const checkEarlyBirdTime = () => {
      const now = new Date();
      const hour = now.getHours();
      // Temporary test: Make it always active
      // const isEarly = hour >= 0 && hour < 24;
      const isEarly = hour >= 5 && hour < 7;

      setIsEarlyBirdTime(isEarly);

      // Only trigger once when entering early bird time
      if (isEarly && !earlyBirdTriggeredRef.current) {
        earlyBirdTriggeredRef.current = true;
        onEasterEggFoundRef.current();
      }
    };

    checkEarlyBirdTime();
    const interval = setInterval(checkEarlyBirdTime, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []); // Empty deps - refs handle the callback

  // Easter Egg 2: Type "EASTER_EGG"
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const key = e.key.toUpperCase();

      setKeySequence(prev => {
        const newSequence = [...prev, key].slice(-10); // Keep last 10 characters
        const currentString = newSequence.join('');
        const targetSequence = 'EASTER_EGG';

        // Check if current sequence matches the beginning of our target
        if (targetSequence.startsWith(currentString) && currentString.length > 0) {
          e.preventDefault(); // Prevent browser search
        }

        if (currentString === targetSequence) {
          e.preventDefault();
          onEasterEggFoundRef.current();
          // Show bird chirp animation
          setShowBird(true);
          setTimeout(() => setShowBird(false), 2000);
          return []; // Reset
        }

        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []); // Empty deps - uses functional setState

  // Easter Egg 3: Flying bird animation
  useEffect(() => {
    let animationFrameId: number;
    let isActive = true;

    const flyBird = () => {
      if (!isActive) return;

      const startY = Math.random() * 60 + 20; // Random Y between 20-80%
      setBirdPosition({ x: -100, y: startY });
      setShowBird(true);

      // Animate bird across screen
      const duration = 15000 + Math.random() * 4000; // 8-12 seconds
      const startTime = Date.now();

      const animate = () => {
        if (!isActive) return;

        const elapsed = Date.now() - startTime;
        const progress = elapsed / duration;

        if (progress < 1) {
          setBirdPosition({
            x: -100 + progress * (window.innerWidth + 200),
            y: startY + Math.sin(progress * 4) * 10, // Gentle wave motion
          });
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setShowBird(false);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    };

    // Show bird every 2-3 minutes
    const showInterval = setInterval(() => {
      if (isActive) flyBird();
    }, 120000 + Math.random() * 60000);

    // Show first bird after 30 seconds
    const initialTimeout = setTimeout(() => {
      if (isActive) flyBird();
    }, 30000);

    return () => {
      isActive = false;
      clearInterval(showInterval);
      clearTimeout(initialTimeout);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  // Easter Egg 7: Hover secret zone (top-right corner)
  const handleSecretZoneEnter = useCallback(() => {
    const timer = setTimeout(() => {
      onEasterEggFoundRef.current();
    }, 3000); // 3 seconds hover

    setHoverTimer(timer);
  }, []);

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
      onEasterEggFoundRef.current();
    }
  }, []);

  return {
    showBird,
    birdPosition,
    isEarlyBirdTime,
    handleSecretZoneEnter,
    handleSecretZoneLeave,
    handleShiftAltClick,
  };
}
