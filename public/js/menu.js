const grid = document.getElementById('menu-grid');
const filters = document.getElementById('filters');
const featuredGrid = document.getElementById('featured-grid');

function meterHTML(level) {
  return `
    <div class="meter" role="img" aria-label="Caffeine level ${level} percent">
      <span class="meter-label">Caffeine</span>
      <div class="meter-track"><div class="meter-fill" style="width:${level}%"></div></div>
      <span class="meter-value">${level}%</span>
    </div>`;
}

function cardHTML(item) {
  return `
    <article class="card">
      <img src="${item.image}" alt="${item.name}">
      <div class="card-body">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        ${meterHTML(item.caffeine)}
        <span class="price">&#8369;${item.price}</span>
      </div>
    </article>`;
}

async function loadFeatured() {
  try {
    const res = await fetch('/api/menu?category=specialty');
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    const items = await res.json();
    if (!items.length) throw new Error('No featured drinks');
    featuredGrid.innerHTML = items.map(item => `
      <article class="featured-card">
        <img src="${item.image}" alt="${item.name}">
        <div class="featured-body">
          <span class="badge">Featured</span>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          ${meterHTML(item.caffeine)}
          <span class="price">&#8369;${item.price}</span>
        </div>
      </article>`).join('');
  } catch {
    document.getElementById('featured').hidden = true;
  }
}

async function loadMenu(category = 'all') {
  grid.innerHTML = '<p class="status">Compiling your coffee... 0 errors, 0 warnings</p>';
  try {
    const res = await fetch(`/api/menu?category=${encodeURIComponent(category)}`);
    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
    const items = await res.json();
    grid.innerHTML = items.map(cardHTML).join('') || '<p class="status">No drinks in this category yet.</p>';
  } catch (err) {
    grid.innerHTML = `<p class="status">Build failed: ${err.message}</p>`;
  }
}

filters.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  filters.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  loadMenu(btn.dataset.category);
});

loadFeatured();
loadMenu();