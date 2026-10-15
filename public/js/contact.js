const form = document.getElementById('contact-form');
const msg = document.getElementById('form-message');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const params = new URLSearchParams(new FormData(form));
  try {
    const res = await fetch(`/api/contact?${params}`);
    const data = await res.json();
    msg.textContent = res.ok ? data.reply : data.error;
    if (res.ok) form.reset();
  } catch {
    msg.textContent = 'Could not send your message. Please try again.';
  }
});
