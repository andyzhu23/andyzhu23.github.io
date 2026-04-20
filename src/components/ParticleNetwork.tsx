import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  pulse: number;
  active: boolean;
  color: string;
}

const MAX_PARTICLES = 69;

const DUST_COLORS = [
  'rgba(255,255,255,',
  'rgba(100,200,255,',
  'rgba(180,220,255,',
  'rgba(255,200,100,',
  'rgba(255,160,80,',
];

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let W = 0, H = 0;
    let diag = 0;
    let margin = 0;
    const particles: Particle[] = [];
    let running = true;
    let raf = 0;
    let last = 0;

    const spawn = (p: Particle, initial: boolean) => {
      if (initial) {
        p.x = Math.random() * W;
        p.y = Math.random() * H;
      } else {
        const side = Math.floor(Math.random() * 4);
        if (side === 0) { p.x = -margin * 0.5; p.y = Math.random() * H; }
        else if (side === 1) { p.x = W + margin * 0.5; p.y = Math.random() * H; }
        else if (side === 2) { p.x = Math.random() * W; p.y = -margin * 0.5; }
        else { p.x = Math.random() * W; p.y = H + margin * 0.5; }
      }
      const speed = (0.015 + Math.random() * 0.025);
      const ang = Math.random() * Math.PI * 2;
      p.vx = Math.cos(ang) * speed;
      p.vy = Math.sin(ang) * speed;
      p.size = (1.2 + Math.random() * 1.6);
      p.pulse = initial ? 1 : 0;
      p.active = true;
      p.color = DUST_COLORS[(Math.random() * DUST_COLORS.length) | 0];
    };

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      diag = Math.hypot(W, H);
      margin = diag * 0.05;
    };

    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < MAX_PARTICLES; i++) {
      const p: Particle = { x: 0, y: 0, vx: 0, vy: 0, size: 0, pulse: 0, active: false, color: DUST_COLORS[0] };
      spawn(p, true);
      particles.push(p);
    }

    const frame = (t: number) => {
      if (!running) return;
      const dt = last ? Math.min(64, t - last) : 16;
      last = t;

      ctx.clearRect(0, 0, W, H);

      for (const p of particles) {
        if (!p.active) { spawn(p, false); continue; }
        if (p.x < -margin || p.x > W + margin || p.y < -margin || p.y > H + margin) {
          p.active = false;
          continue;
        }
        p.pulse = Math.min(1, p.pulse + 0.003 * dt);
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }

      // Dust particles: soft halo + bright core (matches explosion style)
      for (const p of particles) {
        if (!p.active) continue;
        const a = 0.7 * p.pulse;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (a * 0.15) + ')';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + a + ')';
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-network"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
