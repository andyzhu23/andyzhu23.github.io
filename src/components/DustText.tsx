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
  fireTime: number; // elapsed time when this laser fires
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

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

    // Reset
    explosionParticlesRef.current = [];
    lasersRef.current = [];
    charInfoRef.current = [];
    charLasersRef.current = [];
    impactFlashesRef.current = [];
    sparksRef.current = [];
    phasesInitRef.current = new Set();
    doneFiredRef.current = false;
    startTimeRef.current = performance.now();

    // Compute character positions
    const computeChars = () => {
      ctx.font = `800 ${fontSize}px "Playfair Display", Georgia, serif`;
      const chars: CharInfo[] = [];
      lines.forEach((line, li) => {
        const lineY = cyS - totalH / 2 + lineHeight / 2 + li * lineHeight;
        const fullWidth = ctx.measureText(line).width;
        let curX = cxS - fullWidth / 2;
        for (const ch of line) {
          const m = ctx.measureText(ch);
          chars.push({
            char: ch,
            x: curX + m.width / 2,
            y: lineY,
            width: m.width,
            cleared: false,
          });
          curX += m.width;
        }
      });
      charInfoRef.current = chars;
    };
    computeChars();

    const initExplosion = () => {
      const particles: ExplosionParticle[] = [];
      const maxDim = Math.max(W, H);
      for (let i = 0; i < 500; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Speed scaled to screen size so particles reach the edges
        const speed = 3 + Math.random() * (maxDim * 0.012);
        const colors = [
          'rgba(255,255,255,', 'rgba(100,200,255,',
          'rgba(180,220,255,', 'rgba(255,200,100,',
          'rgba(255,160,80,',
        ];
        particles.push({
          x: cxS + (Math.random() - 0.5) * 30,
          y: cyS + (Math.random() - 0.5) * 30,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1, maxLife: 1.5 + Math.random() * 2.0,
          size: 1.5 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      explosionParticlesRef.current = particles;
    };

    const initLasers = () => {
      const lasers: Laser[] = [];
      for (let i = 0; i < 14; i++) {
        const fromLeft = Math.random() > 0.5;
        const angle = (Math.random() - 0.5) * 0.8 + (fromLeft ? 0 : Math.PI);
        lasers.push({
          x: fromLeft ? -100 : W + 100,
          y: H * 0.1 + Math.random() * H * 0.8,
          angle,
          speed: 15 + Math.random() * 12,
          length: 150 + Math.random() * 250,
          life: 1, maxLife: 0.5 + Math.random() * 0.5,
          color: Math.random() > 0.5 ? 'rgba(100,200,255,' : 'rgba(180,140,255,',
          width: 1.5 + Math.random() * 2.5,
        });
      }
      lasersRef.current = lasers;
    };

    const initCharLasers = () => {
      const chars = charInfoRef.current;
      const colors = ['rgba(100,200,255,', 'rgba(180,140,255,', 'rgba(100,255,220,'];
      const baseFire = 7.0; // first laser fires at this time
      const stagger = 0.25; // time between each laser

      // Shuffle the order so they don't just go left to right
      const indices = chars.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      const cl: CharLaser[] = indices.map((ci, order) => {
        const c = chars[ci];
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.max(W, H) * 0.7;
        return {
          startX: c.x + Math.cos(angle) * dist,
          startY: c.y + Math.sin(angle) * dist,
          targetX: c.x,
          targetY: c.y,
          charIndex: ci,
          fireTime: baseFire + order * stagger,
          progress: 0,
          impactTime: -1,
          color: colors[Math.floor(Math.random() * colors.length)],
          width: 1.5 + Math.random() * 2,
          fired: false,
        };
      });
      charLasersRef.current = cl;
    };

    // ===== DRAW FUNCTIONS =====

    const drawExplosion = (t: number) => {
      // Slow down time for the explosion — everything at 0.4x speed
      const s = t * 0.4;

      // Multiple shockwave rings expanding slowly
      const maxDim = Math.max(W, H);
      for (let r = 0; r < 3; r++) {
        const ringDelay = r * 0.15;
        const rt = s - ringDelay;
        if (rt < 0 || rt > 2.0) continue;
        const ringR = rt * maxDim * 0.5;
        const ringAlpha = Math.max(0, 1 - rt * 0.5);
        ctx.beginPath();
        ctx.arc(cxS, cyS, ringR, 0, Math.PI * 2);
        const hue = r === 0 ? '200, 230, 255' : r === 1 ? '180, 140, 255' : '100, 200, 255';
        ctx.strokeStyle = `rgba(${hue}, ${ringAlpha * 0.35})`;
        ctx.lineWidth = 5 - rt * 2;
        ctx.stroke();
      }

      // Full-screen flash - white fill that fades out slowly
      if (s < 0.5) {
        const whiteAlpha = Math.max(0, 1 - s * 2.5);
        ctx.fillStyle = `rgba(255,255,255,${whiteAlpha})`;
        ctx.fillRect(0, 0, W, H);
      }
      // Radial glow that persists longer
      if (s < 1.5) {
        const flashAlpha = Math.max(0, 1 - s * 0.7);
        const diag = Math.sqrt(W * W + H * H);
        const rad = diag * 0.5 * (0.6 + s * 0.4);
        const grad = ctx.createRadialGradient(cxS, cyS, 0, cxS, cyS, rad);
        grad.addColorStop(0, `rgba(255,255,255,${flashAlpha * 0.8})`);
        grad.addColorStop(0.2, `rgba(255,240,200,${flashAlpha * 0.5})`);
        grad.addColorStop(0.4, `rgba(200,230,255,${flashAlpha * 0.25})`);
        grad.addColorStop(0.7, `rgba(100,180,255,${flashAlpha * 0.08})`);
        grad.addColorStop(1, 'rgba(100,180,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }

      // Screen-wide horizontal streak
      if (s < 1.0) {
        const streakAlpha = Math.max(0, 1 - s) * 0.7;
        ctx.fillStyle = `rgba(255,255,255,${streakAlpha})`;
        ctx.fillRect(0, cyS - 2, W, 4);
        const wideGrad = ctx.createLinearGradient(0, cyS - 30, 0, cyS + 30);
        wideGrad.addColorStop(0, 'rgba(255,255,255,0)');
        wideGrad.addColorStop(0.5, `rgba(200,230,255,${streakAlpha * 0.3})`);
        wideGrad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = wideGrad;
        ctx.fillRect(0, cyS - 30, W, 60);
      }

      // Particles - slower movement to match the slowed explosion
      const dt = 0.016 * 0.4;
      for (const p of explosionParticlesRef.current) {
        p.x += p.vx * 0.4;
        p.y += p.vy * 0.4;
        p.vx *= 0.998;
        p.vy *= 0.998;
        p.life -= dt / p.maxLife;
        if (p.life <= 0) continue;

        const alpha = p.life * 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color + alpha + ')';
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color + '0.5)';
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const drawLasers = (dt: number) => {
      for (const l of lasersRef.current) {
        l.x += Math.cos(l.angle) * l.speed;
        l.y += Math.sin(l.angle) * l.speed;
        l.life -= dt / l.maxLife;
        if (l.life <= 0) continue;

        const tailX = l.x - Math.cos(l.angle) * l.length;
        const tailY = l.y - Math.sin(l.angle) * l.length;
        const alpha = Math.min(1, l.life * 2);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(l.x, l.y);
        ctx.strokeStyle = l.color + (alpha * 0.3) + ')';
        ctx.lineWidth = l.width + 6;
        ctx.shadowBlur = 15;
        ctx.shadowColor = l.color + '0.5)';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(l.x, l.y);
        ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.8})`;
        ctx.lineWidth = l.width;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    };

    const drawDNA = (t: number, fade: number = 1) => {
      if (fade <= 0) return;
      ctx.save();
      ctx.globalAlpha = fade;
      const numPoints = 150;
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
          const z = Math.cos(phase);
          const alpha = (0.3 + z * 0.3) * Math.min(1, (progress - frac) * 5);
          if (alpha <= 0) continue;

          if (firstPoint) { ctx.moveTo(x, y); firstPoint = false; }
          else ctx.lineTo(x, y);

          if (i % 3 === 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(x, y, 2.5 + z * 1.5, 0, Math.PI * 2);
            const nodeColor = strand === 0
              ? `rgba(100, 200, 255, ${alpha})`
              : `rgba(180, 140, 255, ${alpha})`;
            ctx.fillStyle = nodeColor;
            ctx.shadowBlur = 8;
            ctx.shadowColor = nodeColor;
            ctx.fill();
            ctx.restore();
          }
        }

        ctx.strokeStyle = strand === 0
          ? 'rgba(100, 200, 255, 0.4)' : 'rgba(180, 140, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        if (strand === 1 && progress > 0.1) {
          for (let i = 0; i < numPoints * progress; i += 6) {
            const frac = i / numPoints;
            const x0 = -W * 0.15 + (cxS + W * 0.15) * frac;
            const x1 = W * 1.15 + (cxS - W * 1.15) * frac;
            const amplitude = H * 0.3 * (1 - frac * 0.7);
            const phase0 = frac * Math.PI * 2 * 5;
            const y0 = cyS + Math.sin(phase0) * amplitude;
            const y1 = cyS + Math.sin(phase0 + Math.PI) * amplitude;
            const alpha = 0.1 * Math.min(1, (progress - frac) * 5);
            if (alpha <= 0) continue;
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.strokeStyle = `rgba(200, 220, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      ctx.shadowBlur = 0;

      // Convergence flash
      if (t > 0.85 && t < 1.15) {
        const flashT = (t - 0.85) / 0.3;
        const flashAlpha = flashT < 0.5 ? flashT * 2 : 2 - flashT * 2;
        const rad = Math.max(W, H) * 0.35;
        const grad = ctx.createRadialGradient(cxS, cyS, 0, cxS, cyS, rad);
        grad.addColorStop(0, `rgba(255,255,255,${flashAlpha * 0.6})`);
        grad.addColorStop(0.3, `rgba(180,210,255,${flashAlpha * 0.25})`);
        grad.addColorStop(1, 'rgba(100,180,255,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      }
      ctx.restore();
    };

    const drawTitle = (_elapsed: number) => {
      const chars = charInfoRef.current;
      ctx.font = `800 ${fontSize}px "Playfair Display", Georgia, serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Metallic gradient
      const grad = ctx.createLinearGradient(0, cyS - fontSize, 0, cyS + fontSize);
      grad.addColorStop(0, 'rgba(180, 215, 255, 0.85)');
      grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.5, 'rgba(160, 200, 255, 0.8)');
      grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(1, 'rgba(180, 215, 255, 0.85)');

      for (const c of chars) {
        ctx.save();

        if (c.cleared) {
          // Clean, crisp character
          ctx.fillStyle = grad;
          ctx.shadowBlur = 15;
          ctx.shadowColor = 'rgba(100, 200, 255, 0.35)';
          ctx.fillText(c.char, c.x, c.y);
        } else {
          // Mutated / distorted character
          const jitterX = (Math.random() - 0.5) * 6;
          const jitterY = (Math.random() - 0.5) * 4;
          const rotation = (Math.random() - 0.5) * 0.08;
          const flicker = 0.25 + Math.random() * 0.25;

          ctx.translate(c.x + jitterX, c.y + jitterY);
          ctx.rotate(rotation);
          ctx.globalAlpha = flicker;

          // Draw multiple offset copies for a glitchy blur
          const glitchColor = `rgba(100, 200, 255, ${flicker * 0.3})`;
          ctx.fillStyle = glitchColor;
          ctx.fillText(c.char, -2, 0);
          ctx.fillStyle = `rgba(180, 140, 255, ${flicker * 0.3})`;
          ctx.fillText(c.char, 2, 0);

          // Main text
          ctx.fillStyle = `rgba(200, 220, 255, ${flicker * 0.7})`;
          ctx.fillText(c.char, 0, 0);
        }

        ctx.restore();
      }
      ctx.shadowBlur = 0;
    };

    const drawCharLasers = (elapsed: number, dt: number) => {
      const chars = charInfoRef.current;

      for (const cl of charLasersRef.current) {
        // Not yet time to fire
        if (elapsed < cl.fireTime) continue;

        if (!cl.fired) {
          cl.fired = true;
          cl.progress = 0;
        }

        const timeSinceFire = elapsed - cl.fireTime;

        if (cl.progress < 1) {
          cl.progress = Math.min(1, timeSinceFire * 3.5); // fast travel
        } else if (cl.impactTime < 0) {
          // Just impacted
          cl.impactTime = 0;
          chars[cl.charIndex].cleared = true;
          impactFlashesRef.current.push({
            x: cl.targetX, y: cl.targetY,
            life: 1, size: 45 + Math.random() * 30,
          });
          // Spawn explosion sparks
          const sparkColors = [
            'rgba(255,255,255,', 'rgba(100,200,255,',
            'rgba(180,140,255,', 'rgba(255,220,100,',
            'rgba(100,255,220,',
          ];
          const laserAngle = Math.atan2(
            cl.targetY - cl.startY, cl.targetX - cl.startX
          );
          for (let s = 0; s < 25; s++) {
            // Sparks spray outward from impact, biased away from laser direction
            const spreadAngle = laserAngle + Math.PI + (Math.random() - 0.5) * Math.PI * 1.4;
            const speed = 2 + Math.random() * 7;
            sparksRef.current.push({
              x: cl.targetX,
              y: cl.targetY,
              vx: Math.cos(spreadAngle) * speed + (Math.random() - 0.5) * 2,
              vy: Math.sin(spreadAngle) * speed + (Math.random() - 0.5) * 2,
              life: 0.5 + Math.random() * 0.6,
              size: 1 + Math.random() * 2.5,
              color: sparkColors[Math.floor(Math.random() * sparkColors.length)],
            });
          }
        } else {
          cl.impactTime += dt;
        }

        if (cl.impactTime > 0.6) continue; // done

        const headX = cl.startX + (cl.targetX - cl.startX) * cl.progress;
        const headY = cl.startY + (cl.targetY - cl.startY) * cl.progress;
        const tailProgress = Math.max(0, cl.progress - 0.2);
        const tailX = cl.startX + (cl.targetX - cl.startX) * tailProgress;
        const tailY = cl.startY + (cl.targetY - cl.startY) * tailProgress;

        const alpha = cl.progress < 1 ? 0.9 : Math.max(0, 1 - cl.impactTime * 2.5);

        // Glow
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.strokeStyle = cl.color + (alpha * 0.4) + ')';
        ctx.lineWidth = cl.width + 8;
        ctx.shadowBlur = 20;
        ctx.shadowColor = cl.color + '0.6)';
        ctx.stroke();

        // Core
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = cl.width;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Impact flashes
      for (const flash of impactFlashesRef.current) {
        flash.life -= dt * 2.5;
        if (flash.life <= 0) continue;
        const grad = ctx.createRadialGradient(
          flash.x, flash.y, 0, flash.x, flash.y, flash.size * flash.life
        );
        grad.addColorStop(0, `rgba(255,255,255,${flash.life * 0.8})`);
        grad.addColorStop(0.4, `rgba(200,230,255,${flash.life * 0.3})`);
        grad.addColorStop(1, 'rgba(100,200,255,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(flash.x, flash.y, flash.size * flash.life, 0, Math.PI * 2);
        ctx.fill();

        for (let s = 0; s < 5; s++) {
          const sa = Math.random() * Math.PI * 2;
          const sd = Math.random() * flash.size * flash.life * 1.5;
          ctx.beginPath();
          ctx.arc(flash.x + Math.cos(sa) * sd, flash.y + Math.sin(sa) * sd, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,255,255,${flash.life * 0.5})`;
          ctx.fill();
        }
      }

      // Explosion sparks
      for (let i = sparksRef.current.length - 1; i >= 0; i--) {
        const s = sparksRef.current[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.96;
        s.vy *= 0.96;
        s.vy += 0.08; // slight gravity
        s.life -= dt * 1.5;
        if (s.life <= 0) {
          sparksRef.current.splice(i, 1);
          continue;
        }
        const alpha = s.life;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = s.color + alpha + ')';
        ctx.shadowBlur = 6;
        ctx.shadowColor = s.color + (alpha * 0.6) + ')';
        ctx.fill();

        // Draw a short trail
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 3, s.y - s.vy * 3);
        ctx.strokeStyle = s.color + (alpha * 0.3) + ')';
        ctx.lineWidth = s.size * alpha * 0.5;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    };

    const animate = () => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      ctx.clearRect(0, 0, W, H);
      const phases = phasesInitRef.current;

      // PHASE 1: Big slow explosion (0 - 5s, runs at 0.4x speed)
      if (elapsed < 5.0) {
        if (!phases.has('explosion')) { initExplosion(); phases.add('explosion'); }
        drawExplosion(elapsed);
      }

      // PHASE 2: Lasers (3.0 - 5.5s)
      if (elapsed > 3.0 && elapsed < 5.5) {
        if (!phases.has('lasers')) { initLasers(); phases.add('lasers'); }
        drawLasers(0.016);
      }

      // PHASE 3: DNA Helix (3.5 - 6.5s, fades out 6.0-6.5s)
      if (elapsed > 3.5 && elapsed < 6.5) {
        const dnaT = (elapsed - 3.5) / 2.5;
        const fade = elapsed > 6.0 ? Math.max(0, 1 - (elapsed - 6.0) / 0.5) : 1;
        drawDNA(dnaT, fade);
      }

      // Show background when DNA phase ends
      if (elapsed > 6.0 && !phases.has('bgShown')) {
        phases.add('bgShown');
        document.body.classList.add('intro-done');
      }

      // PHASE 4: Title appears distorted (6.0s+)
      if (elapsed > 6.0) {
        drawTitle(elapsed);
      }

      // PHASE 5: Per-character lasers (6.8 - ~9s)
      if (elapsed > 6.5) {
        if (!phases.has('charLasers')) { initCharLasers(); phases.add('charLasers'); }
        drawCharLasers(elapsed, 0.016);
      }

      // PHASE 6: Settled — wait 1s after all cleared, then fire callback
      const allCleared = charInfoRef.current.length > 0 &&
        charInfoRef.current.every(c => c.cleared);
      if (allCleared && !doneFiredRef.current) {
        // Record when all chars first cleared
        if (!(phases as any)._clearedAt) {
          (phases as any)._clearedAt = elapsed;
        }
        const sinceCleared = elapsed - (phases as any)._clearedAt;
        if (sinceCleared >= 1.0) {
          doneFiredRef.current = true;
          onAnimationDone?.();
          canvas.style.transition = 'opacity 1.5s ease-out';
          canvas.style.opacity = '0';
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [text, fontSize, onAnimationDone]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        pointerEvents: 'none',
      }}
    />
  );
}
