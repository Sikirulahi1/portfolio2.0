/* motion + capability flags, and the shared countUp helper */

export const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const FINE = window.matchMedia('(pointer: fine)').matches;

export function countUp(el, target) {
  if (RM || target < 2) { el.textContent = target.toLocaleString(); return; }
  const dur = 850, t0 = performance.now();
  (function step(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}
