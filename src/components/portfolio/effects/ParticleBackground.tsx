'use client';

import { useEffect, useRef, useState } from 'react';

interface ParticleBackgroundProps {
  themeColor: string;
}

export default function ParticleBackground({ themeColor }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile/touch-only pointer capabilities (pointer: coarse)
    const mobileCheck = window.matchMedia('(pointer: coarse)').matches;
    setIsMobile(mobileCheck);
    if (mobileCheck) return; // Disable canvas loops entirely on mobile devices

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let isWindowFocused = true;

    const particleCount = 75;
    const connectionDistance = 120;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }> = [];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let mouse = { x: -1000, y: -1000 };
    let lastMouseMoveTime = 0;

    // Throttled mouse movement listener to save processing cycles
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseMoveTime < 16) return; // Throttle to roughly ~60fps updates
      lastMouseMoveTime = now;

      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Disable loop when tab loses focus to save CPU/GPU resource usage
    const handleFocus = () => {
      isWindowFocused = true;
      animate();
    };

    const handleBlur = () => {
      isWindowFocused = false;
      cancelAnimationFrame(animationFrameId);
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Canvas render loop
    const animate = () => {
      if (!isWindowFocused) return;

      ctx.clearRect(0, 0, width, height);

      // Deep dark portfolio canvas backdrop
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      // Draw and update particles
      particles.forEach((p) => {
        // Position update
        p.x += p.vx;
        p.y += p.vy;

        // Interactive mouse magnetic repulsion
        if (mouse.x > -500) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150) {
            const force = (150 - dist) / 1500;
            p.x -= (dx / dist) * force * 1.5;
            p.y -= (dy / dist) * force * 1.5;
          }
        }

        // Bouncing walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Boundaries correction
        if (p.x < 0) p.x = 0;
        if (p.x > width) p.x = width;
        if (p.y < 0) p.y = 0;
        if (p.y > height) p.y = height;

        // Render particle nodes
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${themeColor}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = themeColor;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Render networking links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.hypot(dx, dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${themeColor}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Trigger loop start
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [themeColor]);

  // Mobile fallback is a flat solid dark background to avoid mobile lag completely
  if (isMobile) {
    return <div className="fixed inset-0 bg-[#050508] -z-10" />;
  }

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 block pointer-events-none" />;
}
