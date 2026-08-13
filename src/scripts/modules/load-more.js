/* load-more — batched reveal for the projects / publications / blogs lists.
   Each list shows PAGE items initially (see render.js); the "View more" button
   appends the next PAGE and re-binds pointer FX (glow/tilt) on the new cards.
   When no items remain, the button hides. */
import { $$ } from '../utils/dom.js';
import { lists, PAGE } from '../../render.js';
import { initPointerFX } from './pointer-fx.js';

// how many items each list is currently showing (starts at PAGE after initial render)
const shown = { projects: PAGE, publications: PAGE, blogs: PAGE };

export function initLoadMore() {
  $$('.btn.load-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.list;
      const list = lists[key];
      if (!list) return;
      const grid = document.getElementById(list.grid);
      if (!grid) return;

      const start = shown[key];
      const slice = list.items.slice(start, start + PAGE);
      if (!slice.length) { btn.parentElement.style.display = 'none'; return; }

      // append new cards (skip the reveal delay for cards already on screen)
      const html = slice.map((it, i) => {
        const card = list.build(it, start + i);
        // these are already in view — mark them revealed so they show immediately
        return card.replace('class="', 'class="in ');
      }).join('');
      grid.insertAdjacentHTML('beforeend', html);

      shown[key] = start + slice.length;

      // hide the button when the list is exhausted
      if (shown[key] >= list.items.length) {
        btn.parentElement.style.display = 'none';
      }

      // re-bind glow / tilt / magnetic on the freshly inserted cards
      initPointerFX();
    }, { once: false });
  });
}
