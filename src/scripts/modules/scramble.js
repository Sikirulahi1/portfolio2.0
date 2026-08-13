/* scramble-decode headings — reveals the real text by walking random chars.
   Exported and called by reveal.js on [data-scramble] elements when they intersect. */
import { RM } from '../utils/motion.js';

export function scramble(el) {
  if (RM || el.dataset.scrambled) return;
  el.dataset.scrambled = '1';
  const CH = '!<>-_/[]{}=+*^?#ΔΣπλ∇';
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let n; while ((n = walker.nextNode())) if (n.data.trim()) nodes.push({ node: n, final: n.data });
  const t0 = performance.now(), dur = 700;
  (function step(t) {
    const p = Math.min((t - t0) / dur, 1);
    nodes.forEach(({ node, final }) => {
      const L = final.length, shown = Math.floor(p * L);
      let s = final.slice(0, shown);
      for (let i = shown; i < L; i++)
        s += final[i] === ' ' ? ' ' : CH[(Math.random() * CH.length) | 0];
      node.data = s;
    });
    if (p < 1) requestAnimationFrame(step);
    else nodes.forEach(({ node, final }) => node.data = final);
  })(t0);
}
