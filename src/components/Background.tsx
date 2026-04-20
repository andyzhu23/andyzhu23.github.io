import { useEffect, useRef } from 'react';

const A = -1;
const B = 1;

interface Pt { x: number; y: number; }

function f(x: number): number {
  return x * x * x + A * x + B;
}

function addPoints(p: Pt, q: Pt): Pt | null {
  let m: number;
  const dx = q.x - p.x;
  const dy = q.y - p.y;
  if (Math.abs(dx) < 1e-10 && Math.abs(dy) < 1e-10) {
    if (Math.abs(p.y) < 1e-10) return null;
    m = (3 * p.x * p.x + A) / (2 * p.y);
  } else if (Math.abs(dx) < 1e-10) {
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
  const mouseDirtyRef = useRef(false);
  const nearestCacheRef = useRef<Pt | null>(null);
  const currentPtRef = useRef<Pt | null>(null);
  const animFrameRef = useRef<number>(0);
  const curvePointsRef = useRef<Pt[]>([]);

  const animatingRef = useRef(false);
  const animProgressRef = useRef(1);
  const animFromRef = useRef<Pt>({ x: 0, y: 0 });
  const animToRef = useRef<Pt>({ x: 0, y: 0 });

  const constructionRef = useRef<{ p: Pt; q: Pt; r: Pt; sum: Pt; alpha: number } | null>(null);

  // Pre-rendered static layer (grid + curve)
  const staticCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const staticDirtyRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    // Offscreen canvas for static elements
    const staticCanvas = document.createElement('canvas');
    staticCanvasRef.current = staticCanvas;

    let scale = 100;
    let cx = 0, cy = 0;
    let W = 0, H = 0;

    const toScreen = (p: Pt): [number, number] => [
      W / 2 + p.x * scale + cx,
      H / 2 - p.y * scale + cy,
    ];

    const toMath = (sx: number, sy: number): Pt => ({
      x: (sx - W / 2 - cx) / scale,
      y: (H / 2 + cy - sy) / scale,
    });

    const precompute = () => {
      const pts: Pt[] = [];
      let xMin = -3;
      while (f(xMin) < 0 && xMin < 10) xMin += 0.001;
      const xMax = (W / 2 - cx) / scale + 2;
      for (let x = xMin; x <= xMax; x += 0.015) {
        const val = f(x);
        if (val < 0) continue;
        const y = Math.sqrt(val);
        pts.push({ x, y });
        if (y > 0.001) pts.push({ x, y: -y });
      }
      curvePointsRef.current = pts;
    };

    const renderStatic = () => {
      staticCanvas.width = W;
      staticCanvas.height = H;
      const sctx = staticCanvas.getContext('2d')!;

      const originX = W / 2 + cx;
      const originY = H / 2 + cy;

      // Grid
      sctx.strokeStyle = 'rgba(100, 200, 255, 0.025)';
      sctx.lineWidth = 1;
      for (let gx = originX % scale; gx < W; gx += scale) {
        sctx.beginPath(); sctx.moveTo(gx, 0); sctx.lineTo(gx, H); sctx.stroke();
      }
      for (let gy = originY % scale; gy < H; gy += scale) {
        sctx.beginPath(); sctx.moveTo(0, gy); sctx.lineTo(W, gy); sctx.stroke();
      }

      // Axes
      sctx.strokeStyle = 'rgba(100, 200, 255, 0.06)';
      sctx.beginPath(); sctx.moveTo(0, originY); sctx.lineTo(W, originY); sctx.stroke();
      sctx.beginPath(); sctx.moveTo(originX, 0); sctx.lineTo(originX, H); sctx.stroke();

      // Curve
      const drawBranch = (sign: 1 | -1) => {
        sctx.beginPath();
        let drawing = false;
        let xStart = -3;
        while (f(xStart) < 0 && xStart < 10) xStart += 0.001;
        const xEnd = (W / 2 - cx) / scale + 2;
        const step = Math.max(1 / scale, 0.005);
        for (let x = xStart; x <= xEnd; x += step) {
          const val = f(x);
          if (val < 0) { drawing = false; continue; }
          const y = sign * Math.sqrt(val);
          const sx = W / 2 + x * scale + cx;
          const sy = H / 2 - y * scale + cy;
          if (sx < -20 || sx > W + 20) { if (drawing) drawing = false; continue; }
          if (!drawing) { sctx.moveTo(sx, sy); drawing = true; }
          else sctx.lineTo(sx, sy);
        }
      };

      sctx.strokeStyle = 'rgba(100, 200, 255, 0.35)';
      sctx.lineWidth = 2;
      drawBranch(1); sctx.stroke();
      sctx.beginPath(); drawBranch(-1); sctx.stroke();

      // Equation label
      sctx.font = '13px "JetBrains Mono", "Fira Code", monospace';
      sctx.fillStyle = 'rgba(100, 200, 255, 0.15)';
      sctx.fillText('y\u00B2 = x\u00B3 \u2212 x + 1', 16, H - 16);

      staticDirtyRef.current = false;
    };

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      scale = Math.min(W, H) / 7;
      cx = -scale * 0.3;
      cy = 0;
      precompute();
      staticDirtyRef.current = true;
      if (!currentPtRef.current) {
        currentPtRef.current = { x: 0, y: Math.sqrt(f(0)) };
      }
    };

    const findNearest = (target: Pt): Pt | null => {
      const pts = curvePointsRef.current;
      if (!pts.length) return null;
      let best = pts[0], bestD = Infinity;
      for (const p of pts) {
        const d = (p.x - target.x) ** 2 + (p.y - target.y) ** 2;
        if (d < bestD) { bestD = d; best = p; }
      }
      return best;
    };

    resize();
    window.addEventListener('resize', () => { resize(); });

    const onMove = (e: MouseEvent) => {
      mouseScreenRef.current = { x: e.clientX, y: e.clientY };
      mouseDirtyRef.current = true;
    };
    const onLeave = () => {
      mouseScreenRef.current = { x: -9999, y: -9999 };
      nearestCacheRef.current = null;
      mouseDirtyRef.current = false;
    };
    const onClick = () => {
      const cur = currentPtRef.current;
      if (!cur || animatingRef.current) return;
      const mouse = mouseScreenRef.current;
      if (mouse.x < -9000) return;
      const nearest = nearestCacheRef.current || findNearest(toMath(mouse.x, mouse.y));
      if (!nearest) return;
      const result = addPoints(cur, nearest);
      if (!result || !isFinite(result.x) || !isFinite(result.y) || Math.abs(result.x) > 50) {
        const rx = Math.random() * 2;
        currentPtRef.current = { x: rx, y: Math.sqrt(Math.max(0, f(rx))) };
        return;
      }
      constructionRef.current = { p: { ...cur }, q: { ...nearest }, r: { x: result.x, y: -result.y }, sum: result, alpha: 1 };
      animFromRef.current = { ...cur };
      animToRef.current = result;
      animProgressRef.current = 0;
      animatingRef.current = true;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('click', onClick);

    const animate = () => {
      // Render static layer if dirty
      if (staticDirtyRef.current) renderStatic();

      ctx.clearRect(0, 0, W, H);
      // Blit static layer (grid + curve + label)
      ctx.drawImage(staticCanvas, 0, 0);

      // Update point animation
      if (animatingRef.current) {
        animProgressRef.current = Math.min(1, animProgressRef.current + 0.035);
        const t = animProgressRef.current;
        const e = 1 - (1 - t) ** 3;
        currentPtRef.current = {
          x: animFromRef.current.x + (animToRef.current.x - animFromRef.current.x) * e,
          y: animFromRef.current.y + (animToRef.current.y - animFromRef.current.y) * e,
        };
        if (t >= 1) { currentPtRef.current = { ...animToRef.current }; animatingRef.current = false; }
      }

      if (constructionRef.current) {
        constructionRef.current.alpha -= 0.012;
        if (constructionRef.current.alpha <= 0) constructionRef.current = null;
      }

      const mouse = mouseScreenRef.current;
      const cur = currentPtRef.current;
      if (!cur) { animFrameRef.current = requestAnimationFrame(animate); return; }

      // Only recompute nearest when mouse moves
      if (mouseDirtyRef.current && mouse.x > -9000) {
        nearestCacheRef.current = findNearest(toMath(mouse.x, mouse.y));
        mouseDirtyRef.current = false;
      }

      if (mouse.x > -9000 && nearestCacheRef.current) {
        const nearest = nearestCacheRef.current;
        const [nx, ny] = toScreen(nearest);

        // Nearest point — simple circle, no shadow
        ctx.beginPath();
        ctx.arc(nx, ny, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(100, 255, 220, 0.5)';
        ctx.fill();

        // Dashed line to mouse
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = 'rgba(100, 255, 220, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Addition chord
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

        // Q label
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(100, 255, 220, 0.5)';
        ctx.fillText(`Q(${nearest.x.toFixed(2)}, ${nearest.y.toFixed(2)})`, nx + 10, ny - 10);
      }

      // Construction lines
      const c = constructionRef.current;
      if (c && c.alpha > 0) {
        const a = c.alpha;
        const ldx = c.q.x - c.p.x, ldy = c.q.y - c.p.y;
        const len = Math.sqrt(ldx * ldx + ldy * ldy);
        if (len > 0.001) {
          const ext = 30;
          const [lx1, ly1] = toScreen({ x: c.p.x - ldx / len * ext, y: c.p.y - ldy / len * ext });
          const [lx2, ly2] = toScreen({ x: c.q.x + ldx / len * ext, y: c.q.y + ldy / len * ext });
          ctx.beginPath(); ctx.moveTo(lx1, ly1); ctx.lineTo(lx2, ly2);
          ctx.strokeStyle = `rgba(255,180,100,${a * 0.25})`; ctx.lineWidth = 1; ctx.stroke();
        }
        const [rx, ry] = toScreen(c.r);
        const [sx, sy] = toScreen(c.sum);
        ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(sx, sy);
        ctx.strokeStyle = `rgba(255,180,100,${a * 0.35})`; ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
        ctx.beginPath(); ctx.arc(rx, ry, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,180,100,${a * 0.4})`; ctx.fill();
      }

      // Current point P — glow via concentric circles, no shadowBlur
      const [cpx, cpy] = toScreen(cur);
      ctx.beginPath();
      ctx.arc(cpx, cpy, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 200, 255, 0.08)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cpx, cpy, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 200, 255, 0.85)';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cpx, cpy, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200, 240, 255, 0.9)';
      ctx.fill();

      // P label
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
    <canvas ref={canvasRef} className="ec-background"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
