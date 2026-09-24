document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (data.success) {
        window.location.href = data.redirect;
      } else {
        const errorMsg = document.getElementById('errorMsg');
        errorMsg.textContent = data.message || 'Login failed';
        errorMsg.style.display = 'block';
      }
    });
  }

  const ctrlButtons = document.querySelectorAll('.ctrl-btn');
  ctrlButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const actionName = btn.getAttribute('data-action');
      const res = await fetch('/api/control/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionName })
      });

      const outputConsole = document.getElementById('outputConsole');
      if (res.ok) {
        const data = await res.json();
        outputConsole.textContent = `[SUCCESS] Executed '${data.action}'`;
      } else {
        outputConsole.textContent = `[ERROR] Action failed or session expired.`;
      }
    });
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      await fetch('/logout', { method: 'POST' });
      window.location.href = '/login.html';
    });
  }
});