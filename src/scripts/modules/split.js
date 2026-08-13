/* name — split [data-split] rows into letters for the cascade.
   Must run AFTER render.js injects the hero name rows, and BEFORE initIntro(). */
import { $$ } from '../utils/dom.js';

export function initSplit() {
  let idx = 0;
  $$('[data-split]').forEach(row => {
    const text = row.textContent;
    const endDot = row.hasAttribute('data-enddot');
    row.textContent = '';
    [...text].forEach(chr => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = chr === ' ' ? ' ' : chr;
      s.style.setProperty('--i', idx++);
      row.appendChild(s);
    });
    if (endDot) {
      const s = document.createElement('span');
      s.className = 'ch end-dot';
      s.textContent = '.';
      s.style.setProperty('--i', idx++);
      row.appendChild(s);
    }
  });
}
