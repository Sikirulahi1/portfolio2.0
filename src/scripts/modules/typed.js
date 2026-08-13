/* typed roles — cycles the phrases from profile.json under the hero name. */
import { $ } from '../utils/dom.js';
import { RM } from '../utils/motion.js';
import profile from '../../data/profile.json';

export function initTyped() {
  const phrases = profile.typedRoles;
  const out = $('#typed');
  if (!out) return;
  if (RM) { out.textContent = phrases[0]; return; }
  let p = 0, i = 0, del = false;
  (function tick() {
    const cur = phrases[p];
    out.textContent = cur.slice(0, i);
    let wait = del ? 26 : 54;
    if (!del && i === cur.length) { wait = 2300; del = true; }
    else if (del && i === 0) { del = false; p = (p + 1) % phrases.length; wait = 480; }
    i += del ? -1 : 1;
    setTimeout(tick, wait);
  })();
}
