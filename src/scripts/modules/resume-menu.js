/* resume-menu — toggles the hero "View résumé" dropdown.
   Opens on button click; closes on outside click or Escape. */
import { $ } from '../utils/dom.js';

export function initResumeMenu() {
  const btn = $('#resumeBtn');
  const menu = $('#resumeMenu');
  if (!btn || !menu) return;

  const close = () => menu.classList.remove('open');
  const toggle = (e) => {
    e.stopPropagation();
    menu.classList.toggle('open');
  };

  btn.addEventListener('click', toggle);
  // close when clicking anywhere outside the menu wrap
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.resume-wrap')) close();
  });
  // close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}
