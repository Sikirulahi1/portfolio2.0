/* toast + copy-email (emerald burst on copy). The #copyMail button is injected
   by render.js into #contactBtns, so initCopyEmail() must run after renderAll(). */
import { $ } from '../utils/dom.js';
import { FX } from './fx.js';
import profile from '../../data/profile.json';

export function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._tm); toast._tm = setTimeout(() => t.classList.remove('show'), 2200);
}

function fallbackCopy(done) {
  const ta = document.createElement('textarea');
  ta.value = profile.email; document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); done(); } catch (e) { toast(profile.email); }
  ta.remove();
}

export function initCopyEmail() {
  const btn = $('#copyMail');
  if (!btn) return;
  const done = () => {
    toast('Email copied — ' + profile.email);
    const r = btn.getBoundingClientRect();
    FX.burst(r.left + r.width / 2, r.top);
  };
  btn.addEventListener('click', () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(profile.email).then(done).catch(() => fallbackCopy(done));
    } else fallbackCopy(done);
  });
}
