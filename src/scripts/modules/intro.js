/* intro — emerald line draws, curtain splits, then triggers the name cascade.
   The name cascade target (#heroName) must already have its .ch spans from split.js,
   so initSplit() must run before initIntro(). */
import { $ } from '../utils/dom.js';
import { store } from '../utils/dom.js';
import { RM } from '../utils/motion.js';

export function initIntro() {
  const el = $('#intro'), name = $('#heroName');
  if (!el || !name) return;
  const go = () => { name.classList.remove('pre'); name.classList.add('go'); };
  if (RM || store.get('hp4-intro')) { el.remove(); go(); return; }
  store.set('hp4-intro', '1');
  requestAnimationFrame(() => el.classList.add('play'));
  setTimeout(go, 850);
  setTimeout(() => el.remove(), 1500);
}
