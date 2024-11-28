document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/api/validate-token', { method: 'GET' });

  if (response.ok) {
    // Si el token es válido, redirige al Dashboard
    window.location.href = '/dashboard';
  }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('password').value;

  const response = await fetch('/api/validate-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  const result = await response.json();
  const message = document.getElementById('message');

  if (result.success) {
    message.textContent = 'Acceso concedido';
    message.style.color = 'green';

    // Redirigir al Dashboard
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1000);
  } else {
    message.textContent = `Error: ${result.error}`;
    message.style.color = 'red';
  }
});
