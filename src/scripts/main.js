/* main.js — entry point. Imports the stylesheet, renders all content from JSON,
   then boots every animation module in dependency order.

   Order matters:
   - renderAll() FIRST so the DOM is populated before anything queries it.
   - initSplit() before initIntro(): the name cascade animates the .ch spans
     that split creates, so the spans must exist before intro triggers them.
   - initReveal()/initActiveNav()/initPointerFX()/initCopyEmail() after render
     so they observe/bind the injected elements. */
import '../styles/main.css';

import { renderAll } from '../render.js';
import { initSplit } from './modules/split.js';
import { initIntro } from './modules/intro.js';
import { initTyped } from './modules/typed.js';
import { initProgress } from './modules/progress.js';
import { initConstellation } from './modules/constellation.js';
import { initCursor } from './modules/cursor.js';
import { initPointerFX } from './modules/pointer-fx.js';
import { initReveal, initActiveNav } from './modules/reveal.js';
import { initCopyEmail } from './modules/toast.js';
import { initGitHub } from './modules/github.js';

renderAll();
initSplit();
initIntro();
initTyped();
initProgress();
initConstellation();
initCursor();
initPointerFX();
initReveal();
initActiveNav();
initCopyEmail();
initGitHub();

const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();
