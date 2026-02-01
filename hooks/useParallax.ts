'use client';

import { useEffect, useRef, useEffectEvent } from 'react';

interface UseParallaxOptions {
  speed?: number; // Speed factor: 0.5 = half speed, 2 = double speed
}

export function useParallax(options: UseParallaxOptions = {}) {
  const { speed = 0.5 } = options;
  const ref = useRef<HTMLElement | SVGSVGElement>(null);

  // Stable event handler that always uses latest speed value
  const handleScroll = useEffectEvent(() => {
    const element = ref.current;
    if (!element) return;

    const scrolled = window.scrollY;
    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + scrolled;
    const distance = scrolled - elementTop;
    const offset = distance * speed;

    element.style.transform = `translateY(${offset}px)`;
  });

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty deps - handleScroll is stable, speed changes don't cause re-subscription

  return ref;
}
