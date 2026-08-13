/* theme — toggles data-theme on <html>, persists the choice, updates the
   mobile theme-color meta, and dispatches `themechange` so the canvas modules
   (constellation, fx) can re-read their palette from CSS tokens.

   The *initial* theme is set by a tiny inline script in index.html <head> to
   avoid a flash of the wrong theme; initTheme() just wires the button. */
import { $ } from '../utils/dom.js';

const KEY = 'hp4-theme';

function current() {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

function apply(theme) {
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem(KEY, theme); } catch (e) { /* ignore */ }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
    if (bg) meta.setAttribute('content', bg);
  }
  document.dispatchEvent(new Event('themechange'));
}

export function initTheme() {
  const btn = $('#themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => apply(current() === 'light' ? 'dark' : 'light'));
}
