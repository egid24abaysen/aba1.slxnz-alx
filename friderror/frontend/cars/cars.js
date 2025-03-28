const API_URL = 'http://localhost:3000/api/cars';
let cars = [];
let makes = [];

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('token')) {
    window.location.href = '../../auth/login.html';
    return;
  }

  loadMakes();
  loadCars();
  setupEventListeners();
});

function setupEventListeners() {
    const userManagementBtn = document.createElement('a');
userManagementBtn.href = '../users/index.html';
userManagementBtn.textContent = 'Manage Users';
userManagementBtn.style.marginLeft = '15px';
document.querySelector('header nav').prepend(userManagementBtn);
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '../../auth/login.html';
  });

  document.getElementById('applyFilters').addEventListener('click', loadCars);
  document.getElementById('resetFilters').addEventListener('click', resetFilters);
  document.getElementById('addCarBtn').addEventListener('click', () => openCarModal());
  document.querySelector('.close').addEventListener('click', () => closeCarModal());
  document.getElementById('carForm').addEventListener('submit', handleCarFormSubmit);
}

async function loadMakes() {
  try {
    const response = await fetch(`${API_URL}/makes`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      throw new Error('Failed to load makes');
    }
    
    makes = await response.json();
    populateMakesDropdown();
  } catch (err) {
    console.error('Error loading makes:', err);
    alert('Failed to load car makes. Please try again.');
  }
}

function populateMakesDropdown() {
  const makeSelect = document.getElementById('make');
  makeSelect.innerHTML = '<option value="">All Makes</option>';
  
  makes.forEach(make => {
    const option = document.createElement('option');
    option.value = make;
    option.textContent = make;
    makeSelect.appendChild(option);
  });
}

async function loadCars() {
  try {
    const search = document.getElementById('search').value;
    const make = document.getElementById('make').value;
    const minYear = document.getElementById('minYear').value;
    const maxPrice = document.getElementById('maxPrice').value;
    
    let url = `${API_URL}?`;
    if (search) url += `search=${encodeURIComponent(search)}&`;
    if (make) url += `make=${encodeURIComponent(make)}&`;
    if (minYear) url += `minYear=${minYear}&`;
    if (maxPrice) url += `maxPrice=${maxPrice}&`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      throw new Error('Failed to load cars');
    }
    
    cars = await response.json();
    renderCars();
  } catch (err) {
    console.error('Error loading cars:', err);
    alert('Failed to load cars. Please try again.');
  }
}

function resetFilters() {
  document.getElementById('search').value = '';
  document.getElementById('make').value = '';
  document.getElementById('minYear').value = '';
  document.getElementById('maxPrice').value = '';
  loadCars();
}

function renderCars() {
  const tbody = document.getElementById('carsTable');
  tbody.innerHTML = '';
  
  if (cars.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="7" style="text-align: center;">No cars found</td>';
    tbody.appendChild(row);
    return;
  }
  
  cars.forEach(car => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${car.make}</td>
      <td>${car.model}</td>
      <td>${car.year}</td>
      <td>${car.color || 'N/A'}</td>
      <td>$${car.price.toLocaleString()}</td>
      <td>${car.owner || 'N/A'}</td>
      <td>
        <button class="btn" data-id="${car.id}" data-action="edit">Edit</button>
        <button class="btn btn-danger" data-id="${car.id}" data-action="delete">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
  
  // Add event listeners to action buttons
  document.querySelectorAll('[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', () => openCarModal(btn.dataset.id));
  });
  
  document.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', () => deleteCar(btn.dataset.id));
  });
}

function openCarModal(carId = null) {
  const modal = document.getElementById('carModal');
  const form = document.getElementById('carForm');
  
  if (carId) {
    document.getElementById('modalTitle').textContent = 'Edit Car';
    const car = cars.find(c => c.id == carId);
    
    if (car) {
      document.getElementById('carId').value = car.id;
      document.getElementById('carMake').value = car.make;
      document.getElementById('carModel').value = car.model;
      document.getElementById('carYear').value = car.year;
      document.getElementById('carColor').value = car.color || '';
      document.getElementById('carPrice').value = car.price;
    }
  } else {
    document.getElementById('modalTitle').textContent = 'Add New Car';
    form.reset();
    document.getElementById('carId').value = '';
  }
  
  modal.style.display = 'block';
}

function closeCarModal() {
  document.getElementById('carModal').style.display = 'none';
}

async function handleCarFormSubmit(e) {
  e.preventDefault();
  
  const carId = document.getElementById('carId').value;
  const carData = {
    make: document.getElementById('carMake').value,
    model: document.getElementById('carModel').value,
    year: document.getElementById('carYear').value,
    color: document.getElementById('carColor').value,
    price: document.getElementById('carPrice').value
  };
  
  try {
    const url = carId ? `${API_URL}/${carId}` : API_URL;
    const method = carId ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(carData)
    });
    
    if (!response.ok) {
      throw new Error(carId ? 'Failed to update car' : 'Failed to add car');
    }
    
    closeCarModal();
    loadCars();
  } catch (err) {
    console.error('Error saving car:', err);
    alert(`Failed to ${carId ? 'update' : 'add'} car. Please try again.`);
  }
}

async function deleteCar(carId) {
  if (!confirm('Are you sure you want to delete this car?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/${carId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete car');
    }
    
    loadCars();
  } catch (err) {
    console.error('Error deleting car:', err);
    alert('Failed to delete car. Please try again.');
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '../../auth/login.html';
}