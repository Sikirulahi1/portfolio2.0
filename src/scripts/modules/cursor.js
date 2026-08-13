/* cursor — ring + dot + spark trail (fine pointers only). Imports FX. */
import { $ } from '../utils/dom.js';
import { RM, FINE } from '../utils/motion.js';
import { FX } from './fx.js';

export function initCursor() {
  if (!FINE || RM) return;
  document.documentElement.classList.add('has-cursor');
  const cur = $('#cur'), dot = $('#curDot');
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, lastSpark = 0;
  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    dot.style.left = x + 'px'; dot.style.top = y + 'px';
    const now = performance.now();
    if (now - lastSpark > 55) { lastSpark = now; FX.spark(x, y); }
  }, { passive: true });
  (function follow() {
    cx += (x - cx) * 0.16; cy += (y - cy) * 0.16;
    cur.style.left = cx + 'px'; cur.style.top = cy + 'px';
    requestAnimationFrame(follow);
  })();
  const hoverables = 'a, button';
  document.addEventListener('pointerover', e => { if (e.target.closest(hoverables)) cur.classList.add('hov'); });
  document.addEventListener('pointerout', e => { if (e.target.closest(hoverables)) cur.classList.remove('hov'); });
}
