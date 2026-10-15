const output = document.getElementById('terminal-output');
const form = document.getElementById('terminal-form');
const input = document.getElementById('terminal-input');
const cart = [];

function print(text, type = '') {
  const p = document.createElement('p');
  p.textContent = text;
  if (type) p.className = type;
  output.appendChild(p);
  output.scrollTop = output.scrollHeight;
}

async function getJSON(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

function showHelp() {
  print('Commands:');
  print('  menu [category]   list drinks (classic, milk, iced, specialty)');
  print('  order <name|id>   add a drink to your cart');
  print('  cart              show your cart');
  print('  checkout          place your order');
  print('  clear             clear the screen');
}

async function showMenu(category) {
  try {
    const url = category ? `/api/menu?category=${encodeURIComponent(category)}` : '/api/menu';
    const items = await getJSON(url);
    if (!items.length) return print(`No drinks found in "${category}".`, 'err');
    items.forEach(i => print(`  ${String(i.id).padStart(2)}  ${i.name.padEnd(26)} P${i.price}`));
  } catch (err) {
    print(`Error: ${err.message}`, 'err');
  }
}

async function order(term) {
  if (!term) return print('Usage: order <name or id>', 'err');
  try {
    let item;
    if (/^\d+$/.test(term)) {
      item = await getJSON(`/api/menu/${term}`);
    } else {
      const matches = await getJSON(`/api/menu?search=${encodeURIComponent(term)}`);
      if (matches.length === 0) {
        return print(`Error 404: "${term}" not found. Type "menu" to see drinks.`, 'err');
      }
      if (matches.length > 1) {
        print('Multiple matches. Be more specific or order by id:', 'warn');
        matches.forEach(m => print(`  ${m.id}  ${m.name}`));
        return;
      }
      item = matches[0];
    }
    cart.push(item);
    print(`1x ${item.name} added to cart. (${cart.length} item${cart.length > 1 ? 's' : ''})`, 'ok');
  } catch (err) {
    print(`Error: ${err.message}`, 'err');
  }
}

function showCart() {
  if (!cart.length) return print('Cart is empty. Try: order latte');
  cart.forEach(i => print(`  ${i.name.padEnd(26)} P${i.price}`));
  const total = cart.reduce((sum, i) => sum + i.price, 0);
  print(`  Total: P${total}`, 'ok');
}

function checkout() {
  if (!cart.length) return print('Nothing to check out. Add a drink first.', 'err');
  const total = cart.reduce((sum, i) => sum + i.price, 0);
  print(`Order placed! Total: P${total}. Your coffee is compiling...`, 'ok');
  cart.length = 0;
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const line = input.value.trim();
  input.value = '';
  if (!line) return;
  print(`$ ${line}`, 'cmd');
  const [cmd, ...rest] = line.split(/\s+/);
  const arg = rest.join(' ');
  switch (cmd.toLowerCase()) {
    case 'help': showHelp(); break;
    case 'menu': await showMenu(arg); break;
    case 'order': await order(arg); break;
    case 'cart': showCart(); break;
    case 'checkout': checkout(); break;
    case 'clear': output.innerHTML = ''; break;
    default: print(`command not found: ${cmd}. Type "help".`, 'err');
  }
});

print('Ctrl+Alt+Brew order terminal. Type "help" to start.');