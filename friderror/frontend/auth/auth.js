const API_URL = 'http://localhost:3000/api/auth';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const errorMessage = document.getElementById('errorMessage');

  // Redirect if already logged in
  if (localStorage.getItem('token')) {
    window.location.href = '../cars/index.html';
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await handleAuth('login');
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match';
        return;
      }
      
      await handleAuth('register');
    });
  }
});

async function handleAuth(action) {
  const form = document.getElementById(`${action}Form`);
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('errorMessage');
  
  let payload = { username, password };
  
  if (action === 'register') {
    payload.email = document.getElementById('email').value;
  }
  
  try {
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Processing...';
    
    const response = await fetch(`${API_URL}/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `${action} failed`);
    }
    
    localStorage.setItem('token', data.token);
    window.location.href = '../cars/index.html';
  } catch (err) {
    errorMessage.textContent = err.message;
  } finally {
    const btn = document.querySelector(`#${action}Form button[type="submit"]`);
    if (btn) {
      btn.disabled = false;
      btn.textContent = action === 'login' ? 'Login' : 'Register';
    }
  }
}