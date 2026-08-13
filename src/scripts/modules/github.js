/* GitHub live — profile · repos · contribution calendar.
   Falls back to the embedded snapshot in github.json if offline / rate-limited.
   Logic is unchanged from the original; data now comes from src/data/github.json. */
import { $ } from '../utils/dom.js';
import { countUp } from '../utils/motion.js';
import gh from '../../data/github.json';

const CONFIG = { user: gh.user, email: gh.email };
const FALLBACK_PROFILE = gh.fallbackProfile;
const FALLBACK_REPOS = gh.fallbackRepos;
const LANG_COLORS = gh.langColors;

const rel = iso => {
  const s = (Date.now() - new Date(iso)) / 1000;
  if (s < 3600) return 'just now';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  if (s < 604800) return Math.floor(s / 86400) + 'd ago';
  if (s < 2592000) return Math.floor(s / 604800) + 'w ago';
  if (s < 31536000) return Math.floor(s / 2592000) + 'mo ago';
  return Math.floor(s / 31536000) + 'y ago';
};
const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function setStatus(state) {
  const chip = $('#ghStatus');
  if (!chip) return;
  chip.className = 'chip' + (state === 'live' ? ' live' : '');
  const label = state === 'live' ? 'LIVE'
    : state === 'limited' ? 'GITHUB RATE-LIMIT · SNAPSHOT'
    : 'OFFLINE · SNAPSHOT';
  chip.innerHTML = '<i></i>' + label;
}
const REPO_ICON = '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/></svg>';

function renderRepos(repos) {
  const feed = $('#repoFeed');
  if (!feed) return;
  const top = repos
    .filter(r => !r.fork)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 6);
  feed.innerHTML = '';
  top.forEach((r, i) => {
    const a = document.createElement('a');
    a.className = 'repo rv in';
    a.style.transitionDelay = (i * 50) + 'ms';
    a.href = r.html_url; a.target = '_blank'; a.rel = 'noopener';
    const lc = LANG_COLORS[r.language] || '#5D6C64';
    a.innerHTML =
      '<div class="rn">' + REPO_ICON + '<span>' + esc(r.name) + '</span>' + (r.fork ? '<span class="fk">FORK</span>' : '') + '</div>' +
      '<div class="rd">' + (r.description ? esc(r.description) : '<span style="opacity:.5">No description yet</span>') + '</div>' +
      '<div class="rm">' +
      (r.language ? '<span><i class="ld" style="background:' + lc + '"></i>' + esc(r.language) + '</span>' : '') +
      '<span>★ ' + r.stargazers_count + '</span>' +
      '<span>updated ' + rel(r.updated_at) + '</span>' +
      '</div>';
    feed.appendChild(a);
  });
}

function renderCalendar(days, total, state) {
  const grid = $('#calGrid'), months = $('#calMonths');
  if (!grid || !months) return;
  grid.classList.remove('ready');
  grid.innerHTML = ''; months.innerHTML = '';
  const first = new Date(days[0].date);
  for (let i = 0; i < first.getDay(); i++) {
    const pad = document.createElement('i'); pad.style.visibility = 'hidden'; grid.appendChild(pad);
  }
  days.forEach((d, idx) => {
    const c = document.createElement('i');
    if (d.level > 0) c.classList.add('l' + Math.min(d.level, 4));
    const col = Math.floor((idx + first.getDay()) / 7);
    c.style.setProperty('--d', (col * 8) + 'ms');
    c.title = d.count + ' contribution' + (d.count === 1 ? '' : 's') + ' · ' + d.date;
    grid.appendChild(c);
  });
  const weeks = Math.ceil((days.length + first.getDay()) / 7);
  months.style.gridTemplateColumns = 'repeat(' + weeks + ', 15px)';
  let lastM = -1;
  for (let w = 0; w < weeks; w++) {
    const idx = Math.min(w * 7 - first.getDay() + 6, days.length - 1);
    const cell = document.createElement('span');
    if (idx >= 0) {
      const m = new Date(days[Math.max(idx, 0)].date).getMonth();
      if (m !== lastM) { cell.textContent = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][m]; lastM = m; }
    }
    months.appendChild(cell);
  }
  requestAnimationFrame(() => requestAnimationFrame(() => grid.classList.add('ready')));
  $('#calTotal').textContent = total.toLocaleString() + ' contributions · last 12 months';
  countUp($('#statContrib'), total);
  setStatus(state);
}

/* deterministic fallback pattern (seeded), used only when APIs are unreachable */
function fallbackCalendar(state) {
  let seed = 54;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const days = []; let total = 0;
  const today = new Date();
  for (let i = 370; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const wd = d.getDay();
    const busy = (wd > 0 && wd < 6 ? 0.52 : 0.3) + (i < 120 ? 0.18 : 0);
    let count = 0;
    if (rand() < busy) count = 1 + Math.floor(rand() * rand() * 9);
    const level = count === 0 ? 0 : count < 2 ? 1 : count < 4 ? 2 : count < 7 ? 3 : 4;
    total += count;
    days.push({ date: d.toISOString().slice(0, 10), count, level });
  }
  renderCalendar(days, total, state);
}

async function loadGitHub() {
  let live = false, limited = false;
  try {
    const [pr, rr] = await Promise.all([
      fetch('https://api.github.com/users/' + CONFIG.user),
      fetch('https://api.github.com/users/' + CONFIG.user + '/repos?per_page=100&sort=updated'),
    ]);
    if (pr.status === 403 || rr.status === 403) limited = true;
    if (!pr.ok || !rr.ok) throw new Error('gh api ' + pr.status + '/' + rr.status);
    const profile = await pr.json();
    const repos = await rr.json();
    countUp($('#statRepos'), profile.public_repos);
    countUp($('#statFollowers'), profile.followers);
    countUp($('#statStars'), repos.reduce((s, r) => s + r.stargazers_count, 0));
    renderRepos(repos);
    live = true;
  } catch (e) {
    console.info('[github] live fetch unavailable (' + e.message + ') — showing embedded snapshot. Expected inside sandboxed previews or when rate-limited (60 req/hour per IP).');
    countUp($('#statRepos'), FALLBACK_PROFILE.public_repos);
    countUp($('#statFollowers'), FALLBACK_PROFILE.followers);
    countUp($('#statStars'), FALLBACK_PROFILE.stars);
    renderRepos(FALLBACK_REPOS);
  }
  try {
    const cr = await fetch('https://github-contributions-api.jogruber.de/v4/' + CONFIG.user + '?y=last');
    if (!cr.ok) throw new Error('contrib api');
    const data = await cr.json();
    const days = data.contributions;
    const total = (data.total && (data.total.lastYear ?? Object.values(data.total)[0])) ||
      days.reduce((s, d) => s + d.count, 0);
    renderCalendar(days, total, 'live');
  } catch (e) {
    fallbackCalendar(limited ? 'limited' : 'snap');
    if (live) setStatus('live');
  }
}

export function initGitHub() {
  loadGitHub();
}
