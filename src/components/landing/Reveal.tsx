'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

type Variant = 'up' | 'left' | 'right' | 'scale';

const VARIANT_CLASS: Record<Variant, string> = {
  up: 'reveal',
  left: 'reveal-left',
  right: 'reveal-right',
  scale: 'reveal-scale',
};

interface RevealProps {
  variant?: Variant;
  stagger?: 0 | 1 | 2 | 3 | 4 | 5;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/**
 * Scroll-reveal island adapted from the Aura template.
 * Aura used a global inline script plus a scroll listener; this version
 * uses IntersectionObserver, animates once, and honors reduced motion.
 */
export function Reveal({ variant = 'up', stagger = 0, as: Tag = 'div', className = '', children }: RevealProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ref = useRef<any>(null);

  useEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('active');
      return;
    }
    if (typeof IntersectionObserver === 'undefined') {
      el.classList.add('active');
      return;
    }
    // Fail-open: the hidden initial state in CSS only applies under
    // html.reveal-js, so content can never get stuck invisible.
    document.documentElement.classList.add('reveal-js');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const staggerClass = stagger > 0 ? `stagger-${stagger}` : '';
  return (
    <Tag ref={ref} className={`${VARIANT_CLASS[variant]} ${staggerClass} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
