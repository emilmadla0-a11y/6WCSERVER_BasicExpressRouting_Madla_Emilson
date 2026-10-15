const current = location.pathname === '/' ? 'home' : location.pathname.replace('/', '');
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.dataset.page === current) a.classList.add('active');
});

const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

function setMenu(open) {
  navLinks.classList.toggle('open', open);
  toggle.classList.toggle('open', open);
  toggle.setAttribute('aria-expanded', String(open));
}

if (toggle && navLinks) {
  toggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
  navLinks.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
}

const shortcuts = [
  { key: 'H', code: 'KeyH', path: '/', label: 'Home' },
  { key: 'M', code: 'KeyM', path: '/menu', label: 'Menu' },
  { key: 'A', code: 'KeyA', path: '/about', label: 'About' },
  { key: 'C', code: 'KeyC', path: '/contact', label: 'Contact' }
];

document.addEventListener('keydown', e => {
  if (!(e.ctrlKey && e.altKey)) return;
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;
  const match = shortcuts.find(s => s.code === e.code);
  if (!match) return;
  e.preventDefault();
  window.location.href = match.path;
});

const bar = document.createElement('footer');
bar.className = 'shortcut-bar';
bar.innerHTML = '<span>Jump to:</span>' + shortcuts.map(s =>
  `<span><kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>${s.key}</kbd> ${s.label}</span>`
).join('');
document.body.appendChild(bar);