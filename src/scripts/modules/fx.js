/* FX layer — cursor spark trail + emerald burst on copy.
   Self-contained; depends only on the #fx canvas. */
import { $ } from '../utils/dom.js';
import { RM } from '../utils/motion.js';

export const FX = (function fx() {
  const cv = $('#fx'), ctx = cv.getContext('2d');
  let W, H, parts = [], running = false;
  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size(); addEventListener('resize', size);
  function loop() {
    ctx.clearRect(0, 0, W, H);
    parts = parts.filter(p => p.life > 0);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy;
      p.vy += p.g; p.vx *= 0.99;
      p.life -= p.decay;
      ctx.globalAlpha = Math.max(p.life, 0);
      if (p.kind === 'conf') {
        p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.62);
        ctx.restore();
      } else {
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, 7); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (parts.length) { requestAnimationFrame(loop); }
    else { running = false; ctx.clearRect(0, 0, W, H); }
  }
  function wake() { if (!running) { running = true; requestAnimationFrame(loop); } }
  /* read from CSS tokens so the spark/confetti palette follows the active theme
     (the ink/white spark would be invisible on a light background otherwise). */
  const fxColors = () => {
    const s = getComputedStyle(document.documentElement);
    return [
      s.getPropertyValue('--em-bright').trim() || '#34D399',
      s.getPropertyValue('--em').trim() || '#10B981',
      s.getPropertyValue('--em-deep').trim() || '#059669',
      s.getPropertyValue('--ink').trim() || '#E9EFEB',
    ];
  };
  return {
    spark(x, y) {
      if (RM) return;
      const COLORS = fxColors();
      parts.push({ kind: 'spark', x, y,
        vx: (Math.random() - .5) * 1.3, vy: -0.3 - Math.random() * 0.8,
        g: 0.04, size: 1.3 + Math.random() * 1.6, life: 1, decay: 0.04,
        c: COLORS[(Math.random() * COLORS.length) | 0] });
      wake();
    },
    burst(x, y) {
      if (RM) return;
      const COLORS = fxColors();
      for (let i = 0; i < 55; i++) {
        const a = Math.random() * Math.PI * 2, sp = 2.5 + Math.random() * 6;
        parts.push({ kind: 'conf', x, y,
          vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 3,
          g: 0.15, rot: Math.random() * 6.28, vr: (Math.random() - .5) * 0.28,
          size: 3.5 + Math.random() * 4.5, life: 1, decay: 0.013,
          c: COLORS[(Math.random() * COLORS.length) | 0] });
      }
      wake();
    }
  };
})();
