import React, { useEffect, useRef } from 'react';
import { useOS } from '../../context/OSContext';

export default function WallpaperBackground() {
  const { state } = useOS();
  const { wallpaper, customWallpaperUrl, animatedBackground } = state.appearance;
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!animatedBackground) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle or star system depending on wallpaper
    const particles = [];
    const count = wallpaper === 'deep_space' ? 80 : 35;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${p.alpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [animatedBackground, wallpaper]);

  // Background visual styling presets
  const renderBackgroundLayer = () => {
    if (wallpaper === 'custom' && customWallpaperUrl) {
      return (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${customWallpaperUrl})` }}
        />
      );
    }

    switch (wallpaper) {
      case 'cyber_grid':
        return (
          <div className="absolute inset-0 bg-[#030712]">
            <div className="absolute inset-0 bg-grid-pattern opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-cyan-950/20" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
          </div>
        );
      case 'lofi_room':
        return (
          <div className="absolute inset-0 bg-[#191512]">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/40 via-[#1c1815] to-orange-950/30" />
            <div className="absolute -top-20 right-10 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-[600px] h-[400px] bg-yellow-700/10 rounded-full blur-[130px] pointer-events-none" />
          </div>
        );
      case 'deep_space':
        return (
          <div className="absolute inset-0 bg-[#02040a]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-950/30 via-[#040814] to-[#02040a]" />
            <div className="absolute top-1/3 left-1/4 w-[600px] h-[400px] bg-indigo-600/15 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] bg-pink-600/10 rounded-full blur-[140px] pointer-events-none" />
          </div>
        );
      case 'minimal_gradient':
        return (
          <div className="absolute inset-0 bg-[#0f1117]">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0d1017] to-zinc-950" />
          </div>
        );
      case 'matrix':
        return (
          <div className="absolute inset-0 bg-[#020d08]">
            <div className="absolute inset-0 bg-grid-pattern opacity-15" />
            <div className="absolute top-0 w-full h-full bg-gradient-to-b from-emerald-950/20 via-transparent to-[#020d08]" />
            <div className="absolute top-1/3 right-1/3 w-[500px] h-[400px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
          </div>
        );
      case 'aurora':
      default:
        return (
          <div className="absolute inset-0 bg-os-bg overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-gradient-to-br from-indigo-600/25 to-purple-800/15 blur-[120px] pointer-events-none animate-pulse-glow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-tl from-purple-600/20 via-pink-600/15 to-transparent blur-[130px] pointer-events-none" />
            <div className="absolute top-[35%] right-[20%] w-[35%] h-[35%] rounded-full bg-cyan-600/15 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 bg-dots-pattern opacity-20 pointer-events-none" />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {renderBackgroundLayer()}
      {animatedBackground && (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" />
      )}
    </div>
  );
}
