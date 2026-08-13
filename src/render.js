/* render.js — reads src/data/*.json and injects content into the index.html shell.
   Runs synchronously (Vite bundles JSON imports at build time) BEFORE any animation
   module inits, so observers / tilt / glow / split all find the injected elements. */
import { $ } from './scripts/utils/dom.js';
import profile from './data/profile.json';
import about from './data/about.json';
import whatido from './data/whatido.json';
import experience from './data/experience.json';
import projects from './data/projects.json';
import publications from './data/publications.json';
import blogs from './data/blogs.json';
import skills from './data/skills.json';
import github from './data/github.json';
import resume from './data/resume.json';

const DOT = '<span class="dot">.</span>';
const set = (id, html) => { const el = $('#' + id); if (el) el.innerHTML = html; };

/* page size for the batched "View more" lists */
export const PAGE = 3;

/* per-list card builders — shared by initial render and load-more.js */
export function projectCard(p, i) {
  return `<article class="proj rv d${(i % 3) + 1}" data-tilt data-glow>` +
    `<div class="proj-top"><span class="yr">${p.year}</span><span class="st"><i></i>SHIPPED</span></div>` +
    `<h3>${p.title}</h3>` +
    `<p>${p.desc}</p>` +
    `<div class="proj-tech">${p.tech}</div>` +
    `<a class="proj-link" href="${p.link}" target="_blank" rel="noopener">View source <span class="arr">→</span></a>` +
    `</article>`;
}
export function pubCard(p, i) {
  return `<article class="card pub-item rv d${(i % 3) + 1}" data-glow>` +
    `<div class="pub-title">${p.title}</div>` +
    `<div class="pub-meta"><span class="venue">${p.venue}</span><span class="yr">${p.year}</span></div>` +
    `<div class="pub-authors">${p.authors}</div>` +
    `<div class="pub-links">${p.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join('')}</div>` +
    `</article>`;
}
export function blogCard(b, i) {
  return `<article class="card blog-card rv d${(i % 3) + 1}" data-glow>` +
    `<span class="blog-date">${b.date}</span>` +
    `<h3>${b.title}</h3>` +
    `<p>${b.excerpt}</p>` +
    `<a class="blog-link" href="${b.link}" target="_blank" rel="noopener">Read post <span class="arr">→</span></a>` +
    `</article>`;
}

/* data refs exported for load-more.js */
export const lists = {
  projects: { items: projects.items, build: projectCard, grid: 'projectsGrid' },
  publications: { items: publications.items, build: pubCard, grid: 'pubsList' },
  blogs: { items: blogs.items, build: blogCard, grid: 'blogsGrid' },
};

function renderNav() {
  set('navBrand', profile.brand + DOT);
  set('navLinks', profile.navLinks.map(l =>
    `<a href="${l.href}" data-nav="${l.nav}">${l.label}</a>`).join(''));
  set('introTag', profile.introTag);
}

function renderHero() {
  const [a, b] = profile.nameRows;
  const nameEl = $('#heroName');
  if (nameEl) {
    nameEl.setAttribute('aria-label', profile.name);
    nameEl.innerHTML =
      `<span class="row" data-split>${a}</span>` +
      `<span class="row outline" data-split data-enddot>${b}</span>`;
  }
  set('heroSub', profile.heroSub);
  const resumeMenuItems = resume.cvs.map(c =>
    `<div class="resume-menu-item">` +
    `<div class="mi-head"><span class="mi-label">${c.label}</span></div>` +
    `<div class="mi-links">` +
    `<a href="${c.file}" target="_blank" rel="noopener">View ↗</a>` +
    `<a href="${c.file}" download>Download ↓</a>` +
    `</div></div>`).join('');
  set('heroBtns',
    `<a class="btn primary" href="#projects" data-mag>View projects <span class="arr">→</span></a>` +
    `<a class="btn" href="#contact" data-mag>Get in touch</a>` +
    `<span class="resume-wrap">` +
    `<button class="btn" id="resumeBtn" data-mag>View résumé <span class="arr">▾</span></button>` +
    `<div class="resume-menu" id="resumeMenu">${resumeMenuItems}</div>` +
    `</span>` +
    `<a class="quiet-link" href="${profile.github}" target="_blank" rel="noopener">GitHub ↗</a>` +
    `<a class="quiet-link" href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>`);
  set('heroMeta', profile.heroMeta.map(m =>
    `<span>${m.k} <b>${m.v}</b></span>`).join(''));
  const photo = $('#heroPhoto');
  if (photo) { photo.src = profile.photo; photo.alt = profile.photoAlt; }
}

function renderAbout() {
  set('aboutTitle', about.title + DOT);
  set('aboutSub', about.sub);
  set('aboutBio',
    about.bio.map(p => `<p>${p}</p>`).join('') +
    `<div class="motto">${about.motto}</div>`);
  set('aboutNow', about.now.map(n =>
    `<div class="now-line"><span class="k">${n.k}</span><span class="v">${n.v}</span></div>`).join(''));
  set('aboutOffClock', about.offClock.map(t => `<span>${t}</span>`).join(''));
}

function renderWhatIDo() {
  set('whatidoTitle', whatido.title + DOT);
  set('whatidoSub', whatido.sub);
  set('whatidoGrid', whatido.items.map((it, i) =>
    `<div class="card do-card rv d${(i % 3) + 1}" data-glow>` +
    `<div class="glyph">${it.glyph}</div>` +
    `<h3>${it.title}</h3>` +
    `<p>${it.desc}</p>` +
    `<span class="tagline">${it.tagline}</span>` +
    `</div>`).join(''));
}

function renderWork() {
  set('workTitle', experience.title + DOT);
  set('workSub', experience.sub);
  set('workTimeline', experience.items.map(it =>
    `<div class="tl-item${it.now ? ' now' : ''}">` +
    `<div class="tl-yr">${it.year}</div>` +
    `<div class="tl-role"><h4>${it.role}</h4><span class="tl-co">${it.company}</span><span class="tl-period">${it.period}</span></div>` +
    `<ul class="tl-bullets">${it.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` +
    `</div>`).join(''));
}

function renderResume() {
  set('resumeTitle', resume.title + DOT);
  set('resumeSub', resume.sub);
  set('resumeGrid', resume.cvs.map((c, i) =>
    `<div class="card resume-card rv d${(i % 3) + 1}" data-glow>` +
    `<h3>${c.label}</h3>` +
    `<p>${c.desc}</p>` +
    `<div class="resume-actions">` +
    `<a class="btn" href="${c.file}" target="_blank" rel="noopener" data-mag>View <span class="arr">↗</span></a>` +
    `<a class="btn" href="${c.file}" download data-mag>Download <span class="arr">↓</span></a>` +
    `</div>` +
    `</div>`).join(''));
}

/* Render the first PAGE items of a list into its grid, plus a "View more"
   button if there are more. Used for projects / publications / blogs. */
function renderList(key) {
  const { items, build, grid } = lists[key];
  const gridEl = $('#' + grid);
  if (!gridEl) return;
  const shown = items.slice(0, PAGE).map((it, i) => build(it, i)).join('');
  gridEl.innerHTML = shown;
  // remove any previous load-more button, then add one if there's more
  const existing = gridEl.parentElement.querySelector('.load-more-row');
  if (existing) existing.remove();
  if (items.length > PAGE) {
    const row = document.createElement('div');
    row.className = 'load-more-row';
    row.innerHTML = `<button class="btn load-more" data-list="${key}" data-mag>View more <span class="arr">↓</span></button>`;
    gridEl.parentElement.appendChild(row);
  }
}

function renderProjects() {
  set('projectsTitle', projects.title + DOT);
  set('projectsSub', projects.sub);
  renderList('projects');
}

function renderPublications() {
  set('pubsTitle', publications.title + DOT);
  set('pubsSub', publications.sub);
  renderList('publications');
}

function renderBlogs() {
  set('blogsTitle', blogs.title + DOT);
  set('blogsSub', blogs.sub);
  renderList('blogs');
}

function renderSkills() {
  set('skillsTitle', skills.title + DOT);
  set('skillsSub', skills.sub);
  set('skillsGrid', skills.cards.map((c, i) =>
    `<div class="card skill-card rv d${(i % 3) + 1}" data-glow>` +
    `<div class="skill-head"><h3>${c.title}</h3><span class="cnt">${c.count}</span></div>` +
    `<div class="tags">${c.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>` +
    `</div>`).join(''));
}

function renderGitHubMeta() {
  set('githubTitle', github.title + DOT);
  set('githubSub', github.sub);
  set('calFoot',
    `LESS<span class="legend"><i></i><i></i><i></i><i></i><i></i></span>MORE` +
    `<span style="margin-left:auto">@${github.user}</span>`);
  set('ghFoot',
    `Feed updates itself from the GitHub API on every visit · ` +
    `<a href="https://github.com/${github.user}?tab=repositories" target="_blank" rel="noopener">view all repos ↗</a>`);
}

function renderContact() {
  set('contactTitle', profile.contactTitle + DOT);
  set('contactNote', profile.contactNote);
  set('contactBtns',
    `<a class="btn primary" href="mailto:${profile.email}" data-mag>${profile.email} <span class="arr">→</span></a>` +
    `<button class="btn" id="copyMail" data-mag>Copy email</button>` +
    `<a class="quiet-link" href="${profile.github}" target="_blank" rel="noopener">GitHub ↗</a>` +
    `<a class="quiet-link" href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>`);
  set('contactMeta',
    `PREFERRED CHANNEL: EMAIL · ${profile.location.toUpperCase()} · ${profile.tz}`);
}

function renderFooter() {
  set('footer',
    `<span>© <span id="yr">2026</span> ${profile.name}</span>` +
    `<span>·</span>` +
    `<span>vanilla + vite, zero framework</span>` +
    `<span style="margin-left:auto">live data: api.github.com</span>`);
}

export function renderAll() {
  renderNav();
  renderHero();
  renderAbout();
  renderWhatIDo();
  renderWork();
  renderResume();
  renderProjects();
  renderPublications();
  renderBlogs();
  renderSkills();
  renderGitHubMeta();
  renderContact();
  renderFooter();
}
