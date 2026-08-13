/* scroll reveal (.rv) + active-nav tracking.
   reveal also triggers scramble() on [data-scramble] titles when they enter.
   Must run AFTER render.js so all .rv and nav-link elements exist. */
import { $$ } from '../utils/dom.js';
import { scramble } from './scramble.js';

export function initReveal() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      if (e.target.hasAttribute('data-scramble')) scramble(e.target);
      io.unobserve(e.target);
    }
  }), { rootMargin: '0px 0px -10% 0px' });
  $$('.rv').forEach(el => io.observe(el));
}

export function initActiveNav() {
  const links = $$('.nav-links a');
  const map = {};
  links.forEach(a => map[a.dataset.nav] = a);
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(a => a.classList.remove('active'));
      const a = map[e.target.id];
      if (a) a.classList.add('active');
    }
  }), { rootMargin: '-40% 0px -55% 0px' });
  ['about', 'work', 'projects', 'publications', 'blogs', 'skills', 'github', 'contact'].forEach(id => {
    const s = document.getElementById(id);
    if (s) io.observe(s);
  });
}
