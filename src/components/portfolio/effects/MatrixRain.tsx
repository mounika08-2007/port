'use client';

import { useEffect, useRef } from 'react';

interface MatrixRainProps {
  themeColor: string;
}

export default function MatrixRain({ themeColor }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Columns size based on font size
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);

    // Rain drop vertical trackers
    let drops: number[] = [];
    const initDrops = () => {
      columns = Math.floor(width / fontSize);
      drops = [];
      for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * -100; // Offset start heights to stagger rainfall
      }
    };
    initDrops();

    const charList = '0101ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテト';

    let lastTime = 0;
    const fps = 24; // Throttle to 24fps for classic retro digital rain feel and CPU efficiency
    const interval = 1000 / fps;
    let animationFrameId: number;

    const draw = (timestamp: number) => {
      animationFrameId = requestAnimationFrame(draw);

      const elapsed = timestamp - lastTime;
      if (elapsed < interval) return;
      lastTime = timestamp - (elapsed % interval);

      // Translucent black screen-clears form trails that merge nicely with dark background and glass cards
      ctx.fillStyle = 'rgba(5, 5, 8, 0.12)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `bold ${fontSize}px "Courier New", monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Grab random character
        const text = charList.charAt(Math.floor(Math.random() * charList.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        if (y > 0) {
          // Dynamic character gradients: leading falling character is white/bright, trails are custom theme color
          const isLead = Math.random() > 0.95;
          ctx.fillStyle = isLead ? '#ffffff' : themeColor;
          ctx.shadowBlur = isLead ? 8 : 2;
          ctx.shadowColor = themeColor;

          ctx.fillText(text, x, y);
          ctx.shadowBlur = 0; // Reset blur
        }

        // Send columns back to top randomly
        if (y > height && Math.random() > 0.985) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    animationFrameId = requestAnimationFrame(draw);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initDrops();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [themeColor]);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 block opacity-25 pointer-events-none" />;
}
