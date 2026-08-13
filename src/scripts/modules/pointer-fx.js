/* pointer FX — magnetic buttons [data-mag], spotlight glow [data-glow], 3D tilt [data-tilt].
   Fine pointers only. Must run AFTER render.js so the data-* elements exist. */
import { $$ } from '../utils/dom.js';
import { RM, FINE } from '../utils/motion.js';

export function initPointerFX() {
  if (!FINE || RM) return;
  $$('[data-mag]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = 'translate(' + (dx * 0.13).toFixed(1) + 'px,' + (dy * 0.2).toFixed(1) + 'px)';
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
  const setGlow = (el, e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    el.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  };
  $$('[data-glow]').forEach(el => {
    el.addEventListener('pointermove', e => setGlow(el, e), { passive: true });
  });
  $$('[data-tilt]').forEach(el => {
    el.addEventListener('pointerenter', () => { el.style.transition = 'transform .12s'; });
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = 'perspective(900px) rotateX(' + (-py * 7).toFixed(2) + 'deg) rotateY(' + (px * 9).toFixed(2) + 'deg) translateY(-2px)';
    });
    el.addEventListener('pointerleave', () => {
      el.style.transition = 'transform .55s cubic-bezier(.2,.9,.3,1)';
      el.style.transform = '';
    });
  });
}
