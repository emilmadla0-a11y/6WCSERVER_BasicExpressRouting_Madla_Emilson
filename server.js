// Name: Madla, Emilson Lio F.
// Section: WD-303

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const menu = [
  { id: 1,  name: 'Hotfix Espresso',        category: 'classic',   price: 90,  image: '/images/espresso.jpg',
    description: 'A rich, bold shot for when the deadline is in an hour.' },
  { id: 2,  name: 'Debug Americano',        category: 'classic',   price: 100, image: '/images/americano.jpg',
    description: 'Espresso stretched with hot water. Smooth and easy to sip while you trace the error.' },
  { id: 3,  name: 'Double Commit Doppio',   category: 'classic',   price: 115, image: '/images/doppio.jpg',
    description: 'Two shots of espresso in one cup, for the long commits.' },

  { id: 4,  name: 'Commit Cappuccino',      category: 'milk',      price: 130, image: '/images/cappuccino.jpg',
    description: 'Equal parts espresso, steamed milk, and froth. A solid, reliable save point.' },
  { id: 5,  name: 'Pull Request Latte',     category: 'milk',      price: 140, image: '/images/latte.jpg',
    description: 'Creamy espresso and steamed milk topped with light foam. Approved by everyone.' },
  { id: 6,  name: 'Merge Mocha',            category: 'milk',      price: 150, image: '/images/mocha.jpg',
    description: 'Espresso and dark chocolate combine cleanly under whipped cream. No conflicts.' },
  { id: 7,  name: 'Main Branch Flat White', category: 'milk',      price: 145, image: '/images/flatwhite.jpg',
    description: 'Double ristretto under silky microfoam. Strong, stable, production-ready.' },

  { id: 8,  name: 'Cache Cold Brew',        category: 'iced',      price: 150, image: '/images/coldbrew.jpg',
    description: 'Steeped for 18 hours and served over ice. Smooth, strong, and already loaded.' },
  { id: 9,  name: 'Hot Reload Iced Latte',  category: 'iced',      price: 150, image: '/images/icedlatte.jpg',
    description: 'Chilled espresso and cold milk over ice. Refreshes instantly.' },
  { id: 10, name: 'Dark Mode Iced Americano', category: 'iced',    price: 125, image: '/images/icedamericano.jpg',
    description: 'Bold espresso over ice and water. Easy on the eyes, hard on sleep.' },

  { id: 11, name: 'Green Build Matcha Latte', category: 'specialty', price: 160, image: '/images/matcha.jpg',
    description: 'Ceremonial matcha whisked with steamed milk. Clean, calm, and caffeinated.' },
  { id: 12, name: 'Git Push Affogato',      category: 'specialty', price: 170, image: '/images/affogato.jpg',
    description: 'A scoop of vanilla ice cream with a hot espresso shot poured over it. Ship it.' }
];

app.use(express.static(PUBLIC_DIR, { index: false }));

function sendPage(file) {
  return (req, res) => {
    console.log(`Rendering ${file}`);
    res.sendFile(path.join(PUBLIC_DIR, file));
  };
}

app.get('/', sendPage('index.html'));
app.get('/menu', sendPage('menu.html'));
app.get('/about', sendPage('about.html'));
app.get('/contact', sendPage('contact.html'));

app.get('/api/menu', (req, res) => {
  const { category, search } = req.query;
  let results = menu;
  if (category && category !== 'all') {
    results = results.filter(item => item.category === category.toLowerCase());
  }
  if (search) {
    const term = search.toLowerCase();
    results = results.filter(item => item.name.toLowerCase().includes(term));
  }
  res.json(results);
});

app.get('/api/menu/:id', (req, res) => {
  const item = menu.find(m => m.id === Number(req.params.id));
  if (!item) {
    return res.status(404).json({ error: `No menu item with id ${req.params.id}` });
  }
  res.json(item);
});

app.get('/api/contact', (req, res) => {
  const { name, email, message } = req.query;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  console.log(`Message from ${name} <${email}>`);
  res.json({ ok: true, reply: `Thanks, ${name}! We'll reply to ${email} soon.` });
});

app.use((req, res) => {
  console.log(`404 Not Found: ${req.originalUrl}`);
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
