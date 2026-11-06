import React, { useEffect, useRef, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only on pointer-capable devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let circleX = mouseX;
    let circleY = mouseY;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Center dot follows instantly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    // Smooth lerp for outer reticle ring
    const loop = () => {
      circleX += (mouseX - circleX) * 0.16;
      circleY += (mouseY - circleY) * 0.16;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${circleX}px, ${circleY}px, 0)`;
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Track clickable elements to expand reticle on hover
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.closest('.uc-globe-wrapper') ||
          target.closest('.uc-pillar-card') ||
          target.closest('.uc-project-card') ||
          target.closest('.uc-reel-card'))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  return (
    <>
      {/* Outer Reticle Circle */}
      <div
        ref={cursorRef}
        className={`uc-reticle-cursor ${isVisible ? 'is-visible' : ''} ${isHovered ? 'is-hovered' : ''}`}
        aria-hidden="true"
      >
        <div className="reticle-outer-ring" />
      </div>

      {/* Center Precise Dot */}
      <div
        ref={dotRef}
        className={`uc-reticle-dot ${isVisible ? 'is-visible' : ''}`}
        aria-hidden="true"
      />
    </>
  );
};
