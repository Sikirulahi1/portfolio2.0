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

const DOT = '<span class="dot">.</span>';
const set = (id, html) => { const el = $('#' + id); if (el) el.innerHTML = html; };

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
  set('heroBtns',
    `<a class="btn primary" href="#projects" data-mag>View projects <span class="arr">→</span></a>` +
    `<a class="btn" href="#contact" data-mag>Get in touch</a>` +
    `<a class="quiet-link" href="${profile.github}" target="_blank" rel="noopener">GitHub ↗</a>` +
    `<a class="quiet-link" href="${profile.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a>`);
  set('heroMeta', profile.heroMeta.map(m =>
    `<span>${m.k} <b>${m.v}</b></span>`).join(''));
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

function renderProjects() {
  set('projectsTitle', projects.title + DOT);
  set('projectsSub', projects.sub);
  set('projectsGrid', projects.items.map((p, i) =>
    `<article class="proj rv d${(i % 3) + 1}" data-tilt data-glow>` +
    `<div class="proj-top"><span class="yr">${p.year}</span><span class="st"><i></i>SHIPPED</span></div>` +
    `<h3>${p.title}</h3>` +
    `<p>${p.desc}</p>` +
    `<div class="proj-tech">${p.tech}</div>` +
    `<a class="proj-link" href="${p.link}" target="_blank" rel="noopener">View source <span class="arr">→</span></a>` +
    `</article>`).join(''));
}

function renderPublications() {
  set('pubsTitle', publications.title + DOT);
  set('pubsSub', publications.sub);
  set('pubsList', publications.items.map((p, i) =>
    `<article class="card pub-item rv d${(i % 3) + 1}" data-glow>` +
    `<div class="pub-title">${p.title}</div>` +
    `<div class="pub-meta"><span class="venue">${p.venue}</span><span class="yr">${p.year}</span></div>` +
    `<div class="pub-authors">${p.authors}</div>` +
    `<div class="pub-links">${p.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`).join('')}</div>` +
    `</article>`).join(''));
}

function renderBlogs() {
  set('blogsTitle', blogs.title + DOT);
  set('blogsSub', blogs.sub);
  set('blogsGrid', blogs.items.map((b, i) =>
    `<article class="card blog-card rv d${(i % 3) + 1}" data-glow>` +
    `<span class="blog-date">${b.date}</span>` +
    `<h3>${b.title}</h3>` +
    `<p>${b.excerpt}</p>` +
    `<a class="blog-link" href="${b.link}" target="_blank" rel="noopener">Read post <span class="arr">→</span></a>` +
    `</article>`).join(''));
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
  renderProjects();
  renderPublications();
  renderBlogs();
  renderSkills();
  renderGitHubMeta();
  renderContact();
  renderFooter();
}
