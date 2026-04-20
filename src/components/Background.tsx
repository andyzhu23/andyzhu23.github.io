import { useEffect, useRef } from 'react';

// Elliptic curve: y² = x³ + Ax + B
const A = -1;
const B = 1;

interface Pt {
  x: number;
  y: number;
}

function f(x: number): number {
  return x * x * x + A * x + B;
}

function addPoints(p: Pt, q: Pt): Pt | null {
  let m: number;
  const dx = q.x - p.x;
  const dy = q.y - p.y;

  if (Math.abs(dx) < 1e-10 && Math.abs(dy) < 1e-10) {
    // Point doubling: tangent slope
    if (Math.abs(p.y) < 1e-10) return null;
    m = (3 * p.x * p.x + A) / (2 * p.y);
  } else if (Math.abs(dx) < 1e-10) {
    // Vertical line → point at infinity
    return null;
  } else {
    m = dy / dx;
  }

  const x3 = m * m - p.x - q.x;
  const y3 = m * (p.x - x3) - p.y;
  return { x: x3, y: y3 };
}

export default function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseScreenRef = useRef<Pt>({ x: -9999, y: -9999 });
  const currentPtRef = useRef<Pt | null>(null);
  const animFrameRef = useRef<number>(0);
  const curvePointsRef = useRef<Pt[]>([]);

  // Animation for point transition
  const animatingRef = useRef(false);
  const animProgressRef = useRef(1);
  const animFromRef = useRef<Pt>({ x: 0, y: 0 });
  const animToRef = useRef<Pt>({ x: 0, y: 0 });

  // Construction line fade
  const constructionRef = useRef<{
    p: Pt; q: Pt; r: Pt; sum: Pt; alpha: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let scale = 100;
    let cx = 0; // screen center x offset
    let cy = 0;

    const toScreen = (p: Pt): [number, number] => [
      canvas.width / 2 + p.x * scale + cx,
      canvas.height / 2 - p.y * scale + cy,
    ];

    const toMath = (sx: number, sy: number): Pt => ({
      x: (sx - canvas.width / 2 - cx) / scale,
      y: (canvas.height / 2 + cy - sy) / scale,
    });

    const precompute = () => {
      const pts: Pt[] = [];
      // Find curve start
      let xMin = -3;
      while (f(xMin) < 0 && xMin < 10) xMin += 0.001;

      const xMax = (canvas.width / 2 - cx) / scale + 2;
      const step = 0.015;

      for (let x = xMin; x <= xMax; x += step) {
        const val = f(x);
        if (val < 0) continue;
        const y = Math.sqrt(val);
        pts.push({ x, y });
        if (y > 0.001) pts.push({ x, y: -y });
      }
      curvePointsRef.current = pts;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      scale = Math.min(canvas.width, canvas.height) / 7;
      cx = -scale * 0.3;
      cy = 0;
      precompute();

      // Init current point
      if (!currentPtRef.current) {
        const ix = 0;
        const iy = Math.sqrt(f(ix));
        currentPtRef.current = { x: ix, y: iy };
      }
    };

    const findNearest = (target: Pt): Pt | null => {
      const pts = curvePointsRef.current;
      if (!pts.length) return null;
      let best = pts[0];
      let bestD = Infinity;
      for (const p of pts) {
        const d = (p.x - target.x) ** 2 + (p.y - target.y) ** 2;
        if (d < bestD) { bestD = d; best = p; }
      }
      return best;
    };

    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      mouseScreenRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouseScreenRef.current = { x: -9999, y: -9999 };
    };
    const onClick = () => {
      const cur = currentPtRef.current;
      if (!cur || animatingRef.current) return;

      const mouse = mouseScreenRef.current;
      if (mouse.x < -9000) return;

      const mMath = toMath(mouse.x, mouse.y);
      const nearest = findNearest(mMath);
      if (!nearest) return;

      const result = addPoints(cur, nearest);
      if (!result || !isFinite(result.x) || !isFinite(result.y) || Math.abs(result.x) > 50) {
        // Reset to a fresh point
        const rx = Math.random() * 2;
        const ry = Math.sqrt(Math.max(0, f(rx)));
        currentPtRef.current = { x: rx, y: Math.random() > 0.5 ? ry : -ry };
        return;
      }

      // Store construction for visual
      constructionRef.current = {
        p: { ...cur },
        q: { ...nearest },
        r: { x: result.x, y: -result.y }, // pre-reflection
        sum: result,
        alpha: 1,
      };

      // Animate transition
      animFromRef.current = { ...cur };
      animToRef.current = result;
      animProgressRef.current = 0;
      animatingRef.current = true;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('click', onClick);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update point animation
      if (animatingRef.current) {
        animProgressRef.current = Math.min(1, animProgressRef.current + 0.035);
        const t = animProgressRef.current;
        const e = 1 - (1 - t) * (1 - t) * (1 - t); // ease-out cubic
        currentPtRef.current = {
          x: animFromRef.current.x + (animToRef.current.x - animFromRef.current.x) * e,
          y: animFromRef.current.y + (animToRef.current.y - animFromRef.current.y) * e,
        };
        if (t >= 1) {
          currentPtRef.current = { ...animToRef.current };
          animatingRef.current = false;
        }
      }

      // Fade construction lines
      if (constructionRef.current) {
        constructionRef.current.alpha -= 0.012;
        if (constructionRef.current.alpha <= 0) constructionRef.current = null;
      }

      // --- Draw subtle grid ---
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.025)';
      ctx.lineWidth = 1;
      const gs = scale;
      const originX = canvas.width / 2 + cx;
      const originY = canvas.height / 2 + cy;
      for (let gx = originX % gs; gx < canvas.width; gx += gs) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, canvas.height); ctx.stroke();
      }
      for (let gy = originY % gs; gy < canvas.height; gy += gs) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(canvas.width, gy); ctx.stroke();
      }

      // --- Draw axes ---
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, originY); ctx.lineTo(canvas.width, originY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(originX, 0); ctx.lineTo(originX, canvas.height); ctx.stroke();

      // --- Draw the curve ---
      const xScreenMin = -1;
      const xScreenMax = canvas.width + 1;

      // Collect visible curve segments (upper and lower branch)
      const drawBranch = (sign: 1 | -1) => {
        ctx.beginPath();
        let drawing = false;
        // Find curve x range
        let xStart = -3;
        while (f(xStart) < 0 && xStart < 10) xStart += 0.001;
        const xEnd = (canvas.width / 2 - cx) / scale + 2;
        const step = 0.5 / scale; // sub-pixel resolution

        for (let x = xStart; x <= xEnd; x += Math.max(step, 0.003)) {
          const val = f(x);
          if (val < 0) { drawing = false; continue; }
          const y = sign * Math.sqrt(val);
          const [sx, sy] = toScreen({ x, y });
          if (sx < xScreenMin - 20 || sx > xScreenMax + 20) {
            if (drawing) drawing = false;
            continue;
          }
          if (!drawing) { ctx.moveTo(sx, sy); drawing = true; }
          else ctx.lineTo(sx, sy);
        }
      };

      ctx.strokeStyle = 'rgba(100, 200, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(100, 200, 255, 0.25)';
      drawBranch(1);
      ctx.stroke();
      ctx.beginPath();
      drawBranch(-1);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // --- Equation label ---
      ctx.font = '13px "JetBrains Mono", "Fira Code", monospace';
      ctx.fillStyle = 'rgba(100, 200, 255, 0.15)';
      ctx.fillText('y\u00B2 = x\u00B3 \u2212 x + 1', 16, canvas.height - 16);

      // --- Mouse interaction ---
      const mouse = mouseScreenRef.current;
      const cur = currentPtRef.current;
      if (!cur) { animFrameRef.current = requestAnimationFrame(animate); return; }

      if (mouse.x > -9000) {
        const mMath = toMath(mouse.x, mouse.y);
        const nearest = findNearest(mMath);

        if (nearest) {
          const [nx, ny] = toScreen(nearest);

          // Nearest point glow
          ctx.beginPath();
          ctx.arc(nx, ny, 5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(100, 255, 220, 0.5)';
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(100, 255, 220, 0.3)';
          ctx.fill();
          ctx.shadowBlur = 0;

          // Dashed line: nearest → mouse
          ctx.beginPath();
          ctx.moveTo(nx, ny);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(100, 255, 220, 0.12)';
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 5]);
          ctx.stroke();
          ctx.setLineDash([]);

          // Addition chord: P → Q extended
          toScreen(cur);
          const ldx = nearest.x - cur.x;
          const ldy = nearest.y - cur.y;
          const len = Math.sqrt(ldx * ldx + ldy * ldy);
          if (len > 0.01) {
            const ext = 30;
            const [lx1, ly1] = toScreen({ x: cur.x - ldx / len * ext, y: cur.y - ldy / len * ext });
            const [lx2, ly2] = toScreen({ x: nearest.x + ldx / len * ext, y: nearest.y + ldy / len * ext });
            ctx.beginPath();
            ctx.moveTo(lx1, ly1);
            ctx.lineTo(lx2, ly2);
            ctx.strokeStyle = 'rgba(180, 140, 255, 0.12)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // Label Q
          ctx.font = '11px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(100, 255, 220, 0.5)';
          ctx.fillText(`Q(${nearest.x.toFixed(2)}, ${nearest.y.toFixed(2)})`, nx + 10, ny - 10);
        }
      }

      // --- Construction lines (after click) ---
      const c = constructionRef.current;
      if (c && c.alpha > 0) {
        const a = c.alpha;

        // Line through P and Q (the secant)
        const ldx = c.q.x - c.p.x;
        const ldy = c.q.y - c.p.y;
        const len = Math.sqrt(ldx * ldx + ldy * ldy);
        if (len > 0.001) {
          const ext = 30;
          const [lx1, ly1] = toScreen({ x: c.p.x - ldx / len * ext, y: c.p.y - ldy / len * ext });
          const [lx2, ly2] = toScreen({ x: c.q.x + ldx / len * ext, y: c.q.y + ldy / len * ext });
          ctx.beginPath();
          ctx.moveTo(lx1, ly1);
          ctx.lineTo(lx2, ly2);
          ctx.strokeStyle = `rgba(255, 180, 100, ${a * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Vertical reflection line: R → P+Q
        const [rx, ry] = toScreen(c.r);
        const [sx, sy] = toScreen(c.sum);
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(255, 180, 100, ${a * 0.35})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Pre-reflection point R
        ctx.beginPath();
        ctx.arc(rx, ry, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 180, 100, ${a * 0.4})`;
        ctx.fill();
      }

      // --- Current point P ---
      const [cpx, cpy] = toScreen(cur);
      ctx.beginPath();
      ctx.arc(cpx, cpy, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 200, 255, 0.85)';
      ctx.shadowBlur = 20;
      ctx.shadowColor = 'rgba(100, 200, 255, 0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner bright dot
      ctx.beginPath();
      ctx.arc(cpx, cpy, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 240, 255, 0.9)';
      ctx.fill();

      // Label P
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(100, 200, 255, 0.6)';
      ctx.fillText(`P(${cur.x.toFixed(2)}, ${cur.y.toFixed(2)})`, cpx + 12, cpy - 12);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="ec-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
