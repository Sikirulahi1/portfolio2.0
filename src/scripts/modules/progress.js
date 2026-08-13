/* scroll progress — emerald bar at the top tracks page scroll. */
import { $ } from '../utils/dom.js';

export function initProgress() {
  const bar = $('#progress');
  if (!bar) return;
  const upd = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + '%';
  };
  addEventListener('scroll', upd, { passive: true });
  addEventListener('resize', upd);
  upd();
}
