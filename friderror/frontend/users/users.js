const API_URL = 'http://localhost:3000/api/users';

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('token')) {
    window.location.href = '../../auth/login.html';
    return;
  }

  loadUsers();
  setupEventListeners();
});

function setupEventListeners() {
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '../../auth/login.html';
  });
}

async function loadUsers() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      throw new Error('Failed to load users');
    }
    
    const users = await response.json();
    renderUsers(users);
  } catch (err) {
    console.error('Error loading users:', err);
    alert('Failed to load users. Please try again.');
  }
}

function renderUsers(users) {
  const tbody = document.getElementById('usersTable');
  tbody.innerHTML = '';
  
  if (users.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="5" style="text-align: center;">No users found</td>';
    tbody.appendChild(row);
    return;
  }
  
  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <button class="btn btn-danger" data-id="${user.id}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
  
  // Add event listeners to delete buttons
  document.querySelectorAll('.btn-danger').forEach(btn => {
    btn.addEventListener('click', () => deleteUser(btn.dataset.id));
  });
}

async function deleteUser(userId) {
  if (!confirm('Are you sure you want to delete this user?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    
    loadUsers();
  } catch (err) {
    console.error('Error deleting user:', err);
    alert('Failed to delete user. Please try again.');
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '../../auth/login.html';
}