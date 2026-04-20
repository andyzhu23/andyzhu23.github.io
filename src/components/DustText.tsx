import { useEffect, useRef } from 'react';

interface Props {
  text: string;
  fontSize?: number;
  onAnimationDone?: () => void;
}

interface ExplosionParticle {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  size: number;
  color: string;
}

interface Laser {
  x: number; y: number;
  angle: number;
  speed: number;
  length: number;
  life: number; maxLife: number;
  color: string;
  width: number;
}

interface CharInfo {
  char: string;
  x: number;
  y: number;
  width: number;
  cleared: boolean;
}

interface CharLaser {
  startX: number; startY: number;
  targetX: number; targetY: number;
  charIndex: number;
  fireTime: number;
  progress: number;
  impactTime: number;
  color: string;
  width: number;
  fired: boolean;
}

interface ImpactFlash {
  x: number; y: number;
  life: number;
  size: number;
}

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  size: number;
  color: string;
}

export default function DustText({ text, fontSize = 80, onAnimationDone }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const explosionParticlesRef = useRef<ExplosionParticle[]>([]);
  const lasersRef = useRef<Laser[]>([]);
  const charInfoRef = useRef<CharInfo[]>([]);
  const charLasersRef = useRef<CharLaser[]>([]);
  const impactFlashesRef = useRef<ImpactFlash[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const phasesInitRef = useRef<Set<string>>(new Set());
  const doneFiredRef = useRef(false);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true })!;

    let W = 0, H = 0, cxS = 0, cyS = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cxS = W / 2;
      cyS = H / 2;
    };
    resize();
    window.addEventListener('resize', resize);

    const lines = text.split('\n');
    const lineHeight = fontSize * 1.15;
    const totalH = lines.length * lineHeight;

    // Pre-create the metallic gradient (reused every frame for title)
    let titleGrad: CanvasGradient | null = null;
    const ensureTitleGrad = () => {
      if (!titleGrad) {
        titleGrad = ctx.createLinearGradient(0, cyS - fontSize, 0, cyS + fontSize);
        titleGrad.addColorStop(0, 'rgba(180, 215, 255, 0.85)');
        titleGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.95)');
        titleGrad.addColorStop(0.5, 'rgba(160, 200, 255, 0.8)');
        titleGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.95)');
        titleGrad.addColorStop(1, 'rgba(180, 215, 255, 0.85)');
      }
      return titleGrad;
    };

    // Reset
    explosionParticlesRef.current = [];
    lasersRef.current = [];
    charInfoRef.current = [];
    charLasersRef.current = [];
    impactFlashesRef.current = [];
    sparksRef.current = [];
    phasesInitRef.current = new Set();
    doneFiredRef.current = false;
    lastTimeRef.current = performance.now();
    startTimeRef.current = performance.now();

    const computeChars = () => {
      ctx.font = `800 ${fontSize}px "Playfair Display", Georgia, serif`;
      const chars: CharInfo[] = [];
      lines.forEach((line, li) => {
        const lineY = cyS - totalH / 2 + lineHeight / 2 + li * lineHeight;
        const fullWidth = ctx.measureText(line).width;
        let curX = cxS - fullWidth / 2;
        for (const ch of line) {
          const m = ctx.measureText(ch);
          chars.push({ char: ch, x: curX + m.width / 2, y: lineY, width: m.width, cleared: false });
          curX += m.width;
        }
      });
      charInfoRef.current = chars;
    };
    computeChars();

    const initExplosion = () => {
      const particles: ExplosionParticle[] = [];
      const maxDim = Math.max(W, H);
      const colors = ['rgba(255,255,255,', 'rgba(100,200,255,', 'rgba(180,220,255,', 'rgba(255,200,100,', 'rgba(255,160,80,'];
      for (let i = 0; i < 250; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * (maxDim * 0.012);
        particles.push({
          x: cxS + (Math.random() - 0.5) * 30,
          y: cyS + (Math.random() - 0.5) * 30,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1, maxLife: 1.5 + Math.random() * 2.0,
          size: 1.5 + Math.random() * 5,
          color: colors[(Math.random() * colors.length) | 0],
        });
      }
      explosionParticlesRef.current = particles;
    };

    const initLasers = () => {
      const lasers: Laser[] = [];
      for (let i = 0; i < 14; i++) {
        const fromLeft = Math.random() > 0.5;
        lasers.push({
          x: fromLeft ? -100 : W + 100,
          y: H * 0.1 + Math.random() * H * 0.8,
          angle: (Math.random() - 0.5) * 0.8 + (fromLeft ? 0 : Math.PI),
          speed: 15 + Math.random() * 12,
          length: 150 + Math.random() * 250,
          life: 1, maxLife: 1.0 + Math.random() * 1.0,
          color: Math.random() > 0.5 ? 'rgba(100,200,255,' : 'rgba(180,140,255,',
          width: 1.5 + Math.random() * 2.5,
        });
      }
      lasersRef.current = lasers;
    };

    const initCharLasers = () => {
      const chars = charInfoRef.current;
      const colors = ['rgba(100,200,255,', 'rgba(180,140,255,', 'rgba(100,255,220,'];
      const indices = chars.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = (Math.random() * (i + 1)) | 0;
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      charLasersRef.current = indices.map((ci, order) => {
        const c = chars[ci];
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.max(W, H) * 0.7;
        return {
          startX: c.x + Math.cos(angle) * dist,
          startY: c.y + Math.sin(angle) * dist,
          targetX: c.x, targetY: c.y,
          charIndex: ci, fireTime: 7.0 + order * 0.25,
          progress: 0, impactTime: -1,
          color: colors[(Math.random() * colors.length) | 0],
          width: 1.5 + Math.random() * 2, fired: false,
        };
      });
    };

    // ===== DRAW FUNCTIONS (no shadowBlur) =====

    const drawExplosion = (t: number) => {
      const s = t * 0.4;
      const maxDim = Math.max(W, H);

      // Shockwave rings
      for (let r = 0; r < 3; r++) {
        const rt = s - r * 0.15;
        if (rt < 0 || rt > 2.0) continue;
        ctx.beginPath();
        ctx.arc(cxS, cyS, rt * maxDim * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(200,230,255,${Math.max(0, 1 - rt * 0.5) * 0.35})`;
        ctx.lineWidth = Math.max(1, 5 - rt * 2);
        ctx.stroke();
      }

      // Full-screen flash
      if (s < 0.5) {
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, 1 - s * 2.5)})`;
        ctx.fillRect(0, 0, W, H);
      }
      // Radial glow
      if (s < 1.5) {
        const a = Math.max(0, 1 - s * 0.7);
        const diag = Math.sqrt(W * W + H * H);
        const grad = ctx.createRadialGradient(cxS, cyS, 0, cxS, cyS, diag * 0.5 * (0.6 + s * 0.4));
        grad.addColorStop(0, `rgba(255,255,255,${a * 0.8})`);
        grad.addColorStop(0.3, `rgba(200,230,255,${a * 0.35})`);
        grad.addColorStop(1, 'rgba(100,180,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      // Horizontal streak
      if (s < 1.0) {
        const a = Math.max(0, 1 - s) * 0.7;
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fillRect(0, cyS - 2, W, 4);
      }

      // Particles — no shadowBlur, just draw circles
      const particles = explosionParticlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * 0.4;
        p.y += p.vy * 0.4;
        p.vx *= 0.998;
        p.vy *= 0.998;
        p.life -= 0.0064 / p.maxLife;
        if (p.life <= 0) { particles.splice(i, 1); continue; }

        const a = p.life * 0.8;
        const r = p.size * p.life;
        // Soft glow: larger faint circle behind
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (a * 0.15) + ')';
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + a + ')';
        ctx.fill();
      }
    };

    const drawLasers = (dt: number) => {
      for (let i = lasersRef.current.length - 1; i >= 0; i--) {
        const l = lasersRef.current[i];
        l.x += Math.cos(l.angle) * l.speed;
        l.y += Math.sin(l.angle) * l.speed;
        l.life -= dt / l.maxLife;
        if (l.life <= 0) { lasersRef.current.splice(i, 1); continue; }

        const tailX = l.x - Math.cos(l.angle) * l.length;
        const tailY = l.y - Math.sin(l.angle) * l.length;
        const a = Math.min(1, l.life * 2);

        // Outer glow (wider, faint)
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(l.x, l.y);
        ctx.strokeStyle = l.color + (a * 0.2) + ')';
        ctx.lineWidth = l.width + 6;
        ctx.stroke();
        // Core (bright)
        ctx.strokeStyle = `rgba(255,255,255,${a * 0.8})`;
        ctx.lineWidth = l.width;
        ctx.stroke();
      }
    };

    const drawDNA = (t: number, fade: number = 1) => {
      if (fade <= 0) return;
      ctx.save();
      ctx.globalAlpha = fade;
      const numPoints = 100; // reduced from 150
      const progress = Math.min(1, t);

      for (let strand = 0; strand < 2; strand++) {
        ctx.beginPath();
        let firstPoint = true;
        const strandOffset = strand * Math.PI;

        for (let i = 0; i < numPoints * progress; i++) {
          const frac = i / numPoints;
          const startX = strand === 0 ? -W * 0.15 : W * 1.15;
          const x = startX + (cxS - startX) * frac;
          const amplitude = H * 0.3 * (1 - frac * 0.7);
          const phase = frac * Math.PI * 2 * 5 + strandOffset;
          const y = cyS + Math.sin(phase) * amplitude;

          if (firstPoint) { ctx.moveTo(x, y); firstPoint = false; }
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = strand === 0 ? 'rgba(60,180,255,0.5)' : 'rgba(255,100,180,0.5)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Leading head at the tip of the strand
        if (progress > 0 && progress < 1) {
          const headFrac = Math.min(progress, 1 - 0.001);
          const headStartX = strand === 0 ? -W * 0.15 : W * 1.15;
          const headX = headStartX + (cxS - headStartX) * headFrac;
          const headAmplitude = H * 0.3 * (1 - headFrac * 0.7);
          const headPhase = headFrac * Math.PI * 2 * 5 + strandOffset;
          const headY = cyS + Math.sin(headPhase) * headAmplitude;
          const headColor = strand === 0 ? '60,180,255' : '255,100,180';

          // Outer glow
          ctx.beginPath();
          ctx.arc(headX, headY, 12, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${headColor},0.1)`;
          ctx.fill();
          // Mid glow
          ctx.beginPath();
          ctx.arc(headX, headY, 7, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${headColor},0.3)`;
          ctx.fill();
          // Bright core
          ctx.beginPath();
          ctx.arc(headX, headY, 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,0.8)`;
          ctx.fill();
        }

        // Nodes — every 6th point, no shadowBlur
        for (let i = 0; i < numPoints * progress; i += 6) {
          const frac = i / numPoints;
          const startX = strand === 0 ? -W * 0.15 : W * 1.15;
          const x = startX + (cxS - startX) * frac;
          const amplitude = H * 0.3 * (1 - frac * 0.7);
          const phase = frac * Math.PI * 2 * 5 + strandOffset;
          const y = cyS + Math.sin(phase) * amplitude;
          const z = Math.cos(phase);
          const a = (0.3 + z * 0.3) * Math.min(1, (progress - frac) * 5);
          if (a <= 0) continue;

          ctx.beginPath();
          ctx.arc(x, y, 2.5 + z, 0, Math.PI * 2);
          ctx.fillStyle = strand === 0
            ? `rgba(60,180,255,${a})` : `rgba(255,100,180,${a})`;
          ctx.fill();
        }

        // Rungs
        if (strand === 1 && progress > 0.1) {
          for (let i = 0; i < numPoints * progress; i += 8) {
            const frac = i / numPoints;
            const x0 = -W * 0.15 + (cxS + W * 0.15) * frac;
            const x1 = W * 1.15 + (cxS - W * 1.15) * frac;
            const amplitude = H * 0.3 * (1 - frac * 0.7);
            const phase0 = frac * Math.PI * 2 * 5;
            const y0 = cyS + Math.sin(phase0) * amplitude;
            const y1 = cyS + Math.sin(phase0 + Math.PI) * amplitude;
            const a = 0.1 * Math.min(1, (progress - frac) * 5);
            if (a <= 0) continue;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.strokeStyle = `rgba(200,220,255,${a})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Convergence flash
      if (t > 0.85 && t < 1.15) {
        const ft = (t - 0.85) / 0.3;
        const fa = ft < 0.5 ? ft * 2 : 2 - ft * 2;
        const grad = ctx.createRadialGradient(cxS, cyS, 0, cxS, cyS, Math.max(W, H) * 0.35);
        grad.addColorStop(0, `rgba(255,255,255,${fa * 0.6})`);
        grad.addColorStop(0.3, `rgba(180,210,255,${fa * 0.25})`);
        grad.addColorStop(1, 'rgba(100,180,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.restore();
    };

    const drawTitle = () => {
      const chars = charInfoRef.current;
      const grad = ensureTitleGrad();
      ctx.font = `800 ${fontSize}px "Playfair Display", Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (const c of chars) {
        if (c.cleared) {
          ctx.fillStyle = grad;
          ctx.fillText(c.char, c.x, c.y);
        } else {
          ctx.save();
          const jx = (Math.random() - 0.5) * 6;
          const jy = (Math.random() - 0.5) * 4;
          const flicker = 0.25 + Math.random() * 0.25;
          ctx.translate(c.x + jx, c.y + jy);
          ctx.rotate((Math.random() - 0.5) * 0.08);
          ctx.globalAlpha = flicker;

          ctx.fillStyle = `rgba(100,200,255,${flicker * 0.3})`;
          ctx.fillText(c.char, -2, 0);
          ctx.fillStyle = `rgba(180,140,255,${flicker * 0.3})`;
          ctx.fillText(c.char, 2, 0);
          ctx.fillStyle = `rgba(200,220,255,${flicker * 0.7})`;
          ctx.fillText(c.char, 0, 0);
          ctx.restore();
        }
      }
    };

    const drawCharLasers = (elapsed: number, dt: number) => {
      const chars = charInfoRef.current;

      for (const cl of charLasersRef.current) {
        if (elapsed < cl.fireTime) continue;
        if (!cl.fired) { cl.fired = true; cl.progress = 0; }

        const timeSinceFire = elapsed - cl.fireTime;
        if (cl.progress < 1) {
          cl.progress = Math.min(1, timeSinceFire * 3.5);
        } else if (cl.impactTime < 0) {
          cl.impactTime = 0;
          chars[cl.charIndex].cleared = true;
          impactFlashesRef.current.push({ x: cl.targetX, y: cl.targetY, life: 1, size: 45 + Math.random() * 30 });
          const sparkColors = ['rgba(255,255,255,', 'rgba(100,200,255,', 'rgba(180,140,255,', 'rgba(255,220,100,'];
          const la = Math.atan2(cl.targetY - cl.startY, cl.targetX - cl.startX);
          for (let s = 0; s < 12; s++) {
            const sa = la + Math.PI + (Math.random() - 0.5) * Math.PI * 1.4;
            const sp = 2 + Math.random() * 7;
            sparksRef.current.push({
              x: cl.targetX, y: cl.targetY,
              vx: Math.cos(sa) * sp + (Math.random() - 0.5) * 2,
              vy: Math.sin(sa) * sp + (Math.random() - 0.5) * 2,
              life: 0.5 + Math.random() * 0.6,
              size: 1 + Math.random() * 2.5,
              color: sparkColors[(Math.random() * sparkColors.length) | 0],
            });
          }
        } else {
          cl.impactTime += dt;
        }

        if (cl.impactTime > 0.8) continue;

        // Direction vector (normalized)
        const dirX = cl.targetX - cl.startX;
        const dirY = cl.targetY - cl.startY;
        const dirLen = Math.sqrt(dirX * dirX + dirY * dirY);
        const ndx = dirX / dirLen;
        const ndy = dirY / dirLen;

        let headX: number, headY: number, tailX: number, tailY: number;
        let a: number;

        if (cl.progress < 1) {
          // Approaching target
          headX = cl.startX + dirX * cl.progress;
          headY = cl.startY + dirY * cl.progress;
          const tp = Math.max(0, cl.progress - 0.2);
          tailX = cl.startX + dirX * tp;
          tailY = cl.startY + dirY * tp;
          a = 0.9;
        } else {
          // Continue past the target in the same direction
          const overshoot = cl.impactTime * dirLen * 3;
          headX = cl.targetX + ndx * overshoot;
          headY = cl.targetY + ndy * overshoot;
          const trailLen = dirLen * 0.2;
          tailX = headX - ndx * trailLen;
          tailY = headY - ndy * trailLen;
          a = Math.max(0, 1 - cl.impactTime * 1.8);
        }

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.strokeStyle = cl.color + (a * 0.3) + ')';
        ctx.lineWidth = cl.width + 6;
        ctx.stroke();
        ctx.strokeStyle = `rgba(255,255,255,${a})`;
        ctx.lineWidth = cl.width;
        ctx.stroke();
      }

      // Impact flashes
      for (let i = impactFlashesRef.current.length - 1; i >= 0; i--) {
        const flash = impactFlashesRef.current[i];
        flash.life -= dt * 2.5;
        if (flash.life <= 0) { impactFlashesRef.current.splice(i, 1); continue; }
        const grad = ctx.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, flash.size * flash.life);
        grad.addColorStop(0, `rgba(255,255,255,${flash.life * 0.8})`);
        grad.addColorStop(0.4, `rgba(200,230,255,${flash.life * 0.3})`);
        grad.addColorStop(1, 'rgba(100,200,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(flash.x, flash.y, flash.size * flash.life, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sparks — no shadowBlur, just trail lines
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const s = sparksRef.current[i];
        s.x += s.vx; s.y += s.vy;
        s.vx *= 0.96; s.vy *= 0.96; s.vy += 0.08;
        s.life -= dt * 1.5;
        if (s.life <= 0) { sparksRef.current.splice(i, 1); continue; }
        const a = s.life;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * a, 0, Math.PI * 2);
        ctx.fillStyle = s.color + a + ')';
        ctx.fill();
        // Trail
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 3, s.y - s.vy * 3);
        ctx.strokeStyle = s.color + (a * 0.3) + ')';
        ctx.lineWidth = s.size * a * 0.5;
        ctx.stroke();
      }
    };

    const animate = () => {
      const now = performance.now();
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const elapsed = (now - startTimeRef.current) / 1000;
      ctx.clearRect(0, 0, W, H);
      const phases = phasesInitRef.current;

      if (elapsed < 5.0) {
        if (!phases.has('explosion')) { initExplosion(); phases.add('explosion'); }
        drawExplosion(elapsed);
      }

      if (elapsed > 3.0 && elapsed < 6.5) {
        if (!phases.has('lasers')) { initLasers(); phases.add('lasers'); }
        drawLasers(dt);
      }

      if (elapsed > 3.5 && elapsed < 6.5) {
        const fade = elapsed > 6.0 ? Math.max(0, 1 - (elapsed - 6.0) / 0.5) : 1;
        drawDNA((elapsed - 3.5) / 2.5, fade);
      }

      if (elapsed > 6.0 && !phases.has('bgShown')) {
        phases.add('bgShown');
        document.body.classList.add('intro-done');
      }

      if (elapsed > 6.0) drawTitle();

      if (elapsed > 6.5) {
        if (!phases.has('charLasers')) { initCharLasers(); phases.add('charLasers'); }
        drawCharLasers(elapsed, dt);
      }

      const allCleared = charInfoRef.current.length > 0 && charInfoRef.current.every(c => c.cleared);
      if (allCleared && !doneFiredRef.current) {
        if (!(phases as any)._clearedAt) (phases as any)._clearedAt = elapsed;
        if (elapsed - (phases as any)._clearedAt >= 1.0) {
          doneFiredRef.current = true;
          onAnimationDone?.();
          canvas.style.transition = 'opacity 1.5s ease-out';
          canvas.style.opacity = '0';
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    // Delay 1s so the layout settles and canvas gets the correct viewport size
    const delayTimer = setTimeout(() => {
      resize();
      computeChars();
      titleGrad = null; // force re-create with correct cyS
      startTimeRef.current = performance.now();
      lastTimeRef.current = performance.now();
      animate();
    }, 1000);

    return () => {
      clearTimeout(delayTimer);
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [text, fontSize, onAnimationDone]);

  return (
    <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2, pointerEvents: 'none' }} />
  );
}
