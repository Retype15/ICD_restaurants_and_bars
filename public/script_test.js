document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const password = document.getElementById('password').value;

  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  const result = await response.json();
  const message = document.getElementById('message');

  if (result.success) {
    message.textContent = `Registro exitoso. Tu ID es ${result.userId}`;
    message.style.color = 'green';
  } else {
    message.textContent = `Error: ${result.error}`;
    message.style.color = 'red';
  }
});
