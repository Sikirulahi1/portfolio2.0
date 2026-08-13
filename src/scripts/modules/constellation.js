/* constellation — emerald points drift; nearby points link faintly, and the
   cursor "retrieves" its neighbors with brighter emerald connections. */
import { $ } from '../utils/dom.js';
import { RM } from '../utils/motion.js';

export function initConstellation() {
  const cv = $('#space');
  if (!cv) return;
  const ctx = cv.getContext('2d');
  let W, H, pts = [], mx = -9e3, my = -9e3, raf;
  const R = 150, LINK = 95, N = 85;

  function build() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pts = [];
    for (let i = 0; i < N; i++) {
      const em = Math.random() < 0.32;
      pts.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * 0.22, vy: (Math.random() - .5) * 0.22,
        r: 1 + Math.random() * 1.3,
        em,
        tw: Math.random() * Math.PI * 2,
      });
    }
    if (RM) drawStatic();
  }
  function drawStatic() {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = p.em ? '#10B981' : '#93A39A';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }
  function frame(t) {
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -15) p.x = W + 15; if (p.x > W + 15) p.x = -15;
      if (p.y < -15) p.y = H + 15; if (p.y > H + 15) p.y = -15;
    }
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        if (Math.abs(dx) > LINK || Math.abs(dy) > LINK) continue;
        const d = Math.hypot(dx, dy);
        if (d < LINK) {
          ctx.globalAlpha = (1 - d / LINK) * 0.07;
          ctx.strokeStyle = '#93A39A';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const p of pts) {
      const d = Math.hypot(p.x - mx, p.y - my);
      const near = d < R ? (1 - d / R) : 0;
      if (near > 0) {
        ctx.globalAlpha = near * 0.5;
        ctx.strokeStyle = '#10B981';
        ctx.beginPath(); ctx.moveTo(mx, my); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
      const twk = (Math.sin(t / 900 + p.tw) + 1) / 2;
      ctx.globalAlpha = Math.min(0.18 + twk * 0.22 + near * 0.55, 1);
      ctx.fillStyle = (p.em || near > 0.15) ? (near > 0.15 ? '#34D399' : '#10B981') : '#93A39A';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r + near * 2, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }
  addEventListener('resize', build);
  build();
  if (!RM) {
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(frame);
    });
    raf = requestAnimationFrame(frame);
  }
}
