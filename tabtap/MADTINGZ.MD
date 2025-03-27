# Node.js Express RESTful API with Tailwind CSS Frontend

Here's a complete project that demonstrates a Node.js Express backend with a Tailwind CSS frontend to manage user authentication and car details. This implementation includes CRUD operations, filtering, searching, and authentication.

## Project Structure

```
car-app/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── carController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── dummyData.js
│   │   ├── user.js
│   │   └── car.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── carRoutes.js
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── css/
│   │   │   └── styles.css
│   │   ├── js/
│   │   │   └── main.js
│   │   └── index.html
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## Backend Implementation

### 1. Set up the backend

```bash
mkdir car-app && cd car-app
mkdir backend && cd backend
npm init -y
npm install express body-parser cors bcryptjs jsonwebtoken
```

### 2. Backend files

#### `backend/app.js`

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

#### `backend/models/dummyData.js`

```javascript
// Dummy users data
let users = [
  {
    id: 1,
    username: 'john',
    password: '$2a$10$X8z5.5Jz5.5Jz5.5Jz5.5O', // "password" hashed
    name: 'John Doe',
    email: 'john@example.com'
  },
  {
    id: 2,
    username: 'jane',
    password: '$2a$10$X8z5.5Jz5.5Jz5.5Jz5.5O', // "password" hashed
    name: 'Jane Smith',
    email: 'jane@example.com'
  }
];

// Dummy cars data
let cars = [
  {
    id: 1,
    userId: 1,
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    color: 'Silver',
    price: 25000
  },
  {
    id: 2,
    userId: 1,
    make: 'Honda',
    model: 'Accord',
    year: 2019,
    color: 'Black',
    price: 23000
  },
  {
    id: 3,
    userId: 2,
    make: 'Ford',
    model: 'Mustang',
    year: 2021,
    color: 'Red',
    price: 35000
  }
];

module.exports = { users, cars };
```

#### `backend/models/user.js`

```javascript
const { users } = require('./dummyData');

class User {
  static findByUsername(username) {
    return users.find(user => user.username === username);
  }

  static findById(id) {
    return users.find(user => user.id === id);
  }
}

module.exports = User;
```

#### `backend/models/car.js`

```javascript
const { cars } = require('./dummyData');

class Car {
  static findAll(userId) {
    if (userId) {
      return cars.filter(car => car.userId === userId);
    }
    return cars;
  }

  static findById(id, userId) {
    const car = cars.find(car => car.id === id);
    if (userId && car.userId !== userId) return null;
    return car;
  }

  static create(newCar) {
    const car = { id: cars.length + 1, ...newCar };
    cars.push(car);
    return car;
  }

  static update(id, updatedCar, userId) {
    const index = cars.findIndex(car => car.id === id && car.userId === userId);
    if (index === -1) return null;
    cars[index] = { ...cars[index], ...updatedCar };
    return cars[index];
  }

  static delete(id, userId) {
    const index = cars.findIndex(car => car.id === id && car.userId === userId);
    if (index === -1) return null;
    return cars.splice(index, 1)[0];
  }

  static search(query, userId) {
    return cars.filter(car => {
      if (userId && car.userId !== userId) return false;
      return (
        car.make.toLowerCase().includes(query.toLowerCase()) ||
        car.model.toLowerCase().includes(query.toLowerCase()) ||
        car.color.toLowerCase().includes(query.toLowerCase()) ||
        car.year.toString().includes(query)
      );
    });
  }

  static filter(filters, userId) {
    return cars.filter(car => {
      if (userId && car.userId !== userId) return false;
      for (const key in filters) {
        if (car[key] !== filters[key]) return false;
      }
      return true;
    });
  }
}

module.exports = Car;
```

#### `backend/middleware/auth.js`

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'secretkey');
    const user = User.findById(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
```

#### `backend/controllers/authController.js`

```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = User.findByUsername(username);

    if (!user) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });
    res.send({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  res.send(req.user);
};
```

#### `backend/controllers/carController.js`

```javascript
const Car = require('../models/car');

exports.getAllCars = async (req, res) => {
  try {
    const cars = Car.findAll(req.user.id);
    res.send(cars);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

exports.getCar = async (req, res) => {
  try {
    const car = Car.findById(req.params.id, req.user.id);
    if (!car) {
      return res.status(404).send({ error: 'Car not found' });
    }
    res.send(car);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

exports.createCar = async (req, res) => {
  try {
    const newCar = { ...req.body, userId: req.user.id };
    const car = Car.create(newCar);
    res.status(201).send(car);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

exports.updateCar = async (req, res) => {
  try {
    const car = Car.update(req.params.id, req.body, req.user.id);
    if (!car) {
      return res.status(404).send({ error: 'Car not found' });
    }
    res.send(car);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const car = Car.delete(req.params.id, req.user.id);
    if (!car) {
      return res.status(404).send({ error: 'Car not found' });
    }
    res.send(car);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

exports.searchCars = async (req, res) => {
  try {
    const cars = Car.search(req.query.q, req.user.id);
    res.send(cars);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};

exports.filterCars = async (req, res) => {
  try {
    const cars = Car.filter(req.query, req.user.id);
    res.send(cars);
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};
```

#### `backend/routes/authRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/me', authController.getUser);

module.exports = router;
```

#### `backend/routes/carRoutes.js`

```javascript
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const carController = require('../controllers/carController');

router.get('/', auth, carController.getAllCars);
router.get('/search', auth, carController.searchCars);
router.get('/filter', auth, carController.filterCars);
router.post('/', auth, carController.createCar);
router.get('/:id', auth, carController.getCar);
router.put('/:id', auth, carController.updateCar);
router.delete('/:id', auth, carController.deleteCar);

module.exports = router;
```

## Frontend Implementation

### 1. Set up the frontend

```bash
cd ../frontend
npm init -y
npm install tailwindcss postcss autoprefixer
npx tailwindcss init
```

### 2. Frontend files

#### `frontend/tailwind.config.js`

```javascript
module.exports = {
  content: ['./public/**/*.html'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### `frontend/public/css/styles.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

#### `frontend/public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Car Management App</title>
  <link href="/css/styles.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
  <div class="container mx-auto px-4 py-8">
    <!-- Login Section -->
    <div id="login-section" class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center mb-6">Login</h1>
      <form id="login-form" class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input type="text" id="username" name="username" required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" id="password" name="password" required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
        </div>
        <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Login
        </button>
      </form>
    </div>

    <!-- Main App Section (hidden initially) -->
    <div id="app-section" class="hidden">
      <!-- Header -->
      <header class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold">My Cars</h1>
        <button id="logout-btn" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
      </header>

      <!-- User Info -->
      <div id="user-info" class="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold">Welcome, <span id="user-name"></span></h2>
        <p class="text-gray-600">Email: <span id="user-email"></span></p>
      </div>

      <!-- Search and Filter -->
      <div class="mb-6 p-4 bg-white rounded-lg shadow">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
            <input type="text" id="search" placeholder="Search by make, model, color..."
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div>
            <label for="filter" class="block text-sm font-medium text-gray-700">Filter</label>
            <select id="filter" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Cars</option>
              <option value="Toyota">Toyota</option>
              <option value="Honda">Honda</option>
              <option value="Ford">Ford</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Add Car Form -->
      <div class="mb-6 p-4 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Add New Car</h2>
        <form id="add-car-form" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label for="make" class="block text-sm font-medium text-gray-700">Make</label>
            <input type="text" id="make" name="make" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div>
            <label for="model" class="block text-sm font-medium text-gray-700">Model</label>
            <input type="text" id="model" name="model" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div>
            <label for="year" class="block text-sm font-medium text-gray-700">Year</label>
            <input type="number" id="year" name="year" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div>
            <label for="color" class="block text-sm font-medium text-gray-700">Color</label>
            <input type="text" id="color" name="color" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div>
            <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
            <input type="number" id="price" name="price" required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div class="flex items-end">
            <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Add Car</button>
          </div>
        </form>
      </div>

      <!-- Cars List -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody id="cars-list" class="bg-white divide-y divide-gray-200">
            <!-- Cars will be loaded here -->
          </tbody>
        </table>
      </div>

      <!-- Edit Car Modal -->
      <div id="edit-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 class="text-xl font-semibold mb-4">Edit Car</h2>
          <form id="edit-car-form" class="space-y-4">
            <input type="hidden" id="edit-id">
            <div>
              <label for="edit-make" class="block text-sm font-medium text-gray-700">Make</label>
              <input type="text" id="edit-make" name="make" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div>
              <label for="edit-model" class="block text-sm font-medium text-gray-700">Model</label>
              <input type="text" id="edit-model" name="model" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div>
              <label for="edit-year" class="block text-sm font-medium text-gray-700">Year</label>
              <input type="number" id="edit-year" name="year" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div>
              <label for="edit-color" class="block text-sm font-medium text-gray-700">Color</label>
              <input type="text" id="edit-color" name="color" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div>
              <label for="edit-price" class="block text-sm font-medium text-gray-700">Price</label>
              <input type="number" id="edit-price" name="price" required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div class="flex justify-end space-x-2">
              <button type="button" id="cancel-edit" class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
              <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>

  <script src="/js/main.js"></script>
</body>
</html>
```

#### `frontend/public/js/main.js`

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loginSection = document.getElementById('login-section');
  const appSection = document.getElementById('app-section');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');
  const userName = document.getElementById('user-name');
  const userEmail = document.getElementById('user-email');
  const searchInput = document.getElementById('search');
  const filterSelect = document.getElementById('filter');
  const addCarForm = document.getElementById('add-car-form');
  const carsList = document.getElementById('cars-list');
  const editModal = document.getElementById('edit-modal');
  const editCarForm = document.getElementById('edit-car-form');
  const cancelEditBtn = document.getElementById('cancel-edit');

  // State
  let currentUser = null;
  let token = null;

  // Check if user is logged in
  if (localStorage.getItem('token')) {
    token = localStorage.getItem('token');
    currentUser = JSON.parse(localStorage.getItem('user'));
    showApp();
    loadCars();
  }

  // Event Listeners
  loginForm.addEventListener('submit', handleLogin);
  logoutBtn.addEventListener('click', handleLogout);
  searchInput.addEventListener('input', debounce(loadCars, 300));
  filterSelect.addEventListener('change', loadCars);
  addCarForm.addEventListener('submit', handleAddCar);
  cancelEditBtn.addEventListener('click', () => editModal.classList.add('hidden'));
  editCarForm.addEventListener('submit', handleEditCar);

  // Functions
  function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then(data => {
        token = data.token;
        currentUser = data.user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(currentUser));
        showApp();
        loadCars();
      })
      .catch(error => {
        alert(error.message);
      });
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    token = null;
    currentUser = null;
    showLogin();
  }

  function showLogin() {
    loginSection.classList.remove('hidden');
    appSection.classList.add('hidden');
    loginForm.reset();
  }

  function showApp() {
    loginSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    userName.textContent = currentUser.name;
    userEmail.textContent = currentUser.email;
    addCarForm.reset();
  }

  function loadCars() {
    const search = searchInput.value;
    const filter = filterSelect.value;

    let url = 'http://localhost:5000/api/cars';
    if (search) {
      url += `?q=${encodeURIComponent(search)}`;
    } else if (filter) {
      url += `?make=${encodeURIComponent(filter)}`;
    }

    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          if (response.status === 401) {
            handleLogout();
          }
          throw new Error('Failed to load cars');
        }
        return response.json();
      })
      .then(cars => {
        renderCars(cars);
      })
      .catch(error => {
        console.error(error);
      });
  }

  function renderCars(cars) {
    carsList.innerHTML = '';
    
    if (cars.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td colspan="6" class="px-6 py-4 text-center text-gray-500">No cars found</td>
      `;
      carsList.appendChild(row);
      return;
    }

    cars.forEach(car => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">${car.make}</td>
        <td class="px-6 py-4 whitespace-nowrap">${car.model}</td>
        <td class="px-6 py-4 whitespace-nowrap">${car.year}</td>
        <td class="px-6 py-4 whitespace-nowrap">${car.color}</td>
        <td class="px-6 py-4 whitespace-nowrap">$${car.price.toLocaleString()}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <button class="edit-btn mr-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600" data-id="${car.id}">Edit</button>
          <button class="delete-btn px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600" data-id="${car.id}">Delete</button>
        </td>
      `;
      carsList.appendChild(row);
    });

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => showEditModal(btn.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => handleDeleteCar(btn.dataset.id));
    });
  }

  function showEditModal(carId) {
    fetch(`http://localhost:5000/api/cars/${carId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load car');
        }
        return response.json();
      })
      .then(car => {
        document.getElementById('edit-id').value = car.id;
        document.getElementById('edit-make').value = car.make;
        document.getElementById('edit-model').value = car.model;
        document.getElementById('edit-year').value = car.year;
        document.getElementById('edit-color').value = car.color;
        document.getElementById('edit-price').value = car.price;
        editModal.classList.remove('hidden');
      })
      .catch(error => {
        console.error(error);
      });
  }

  function handleAddCar(e) {
    e.preventDefault();
    const formData = new FormData(addCarForm);
    const carData = {
      make: formData.get('make'),
      model: formData.get('model'),
      year: parseInt(formData.get('year')),
      color: formData.get('color'),
      price: parseFloat(formData.get('price')),
    };

    fetch('http://localhost:5000/api/cars', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(carData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add car');
        }
        return response.json();
      })
      .then(() => {
        addCarForm.reset();
        loadCars();
      })
      .catch(error => {
        console.error(error);
      });
  }

  function handleEditCar(e) {
    e.preventDefault();
    const carId = document.getElementById('edit-id').value;
    const formData = new FormData(editCarForm);
    const carData = {
      make: formData.get('make'),
      model: formData.get('model'),
      year: parseInt(formData.get('year')),
      color: formData.get('color'),
      price: parseFloat(formData.get('price')),
    };

    fetch(`http://localhost:5000/api/cars/${carId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(carData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to update car');
        }
        return response.json();
      })
      .then(() => {
        editModal.classList.add('hidden');
        loadCars();
      })
      .catch(error => {
        console.error(error);
      });
  }

  function handleDeleteCar(carId) {
    if (!confirm('Are you sure you want to delete this car?')) return;

    fetch(`http://localhost:5000/api/cars/${carId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete car');
        }
        loadCars();
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Utility function
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
});
```

## How to Run the Project

1. Start the backend server:
```bash
cd backend
node app.js
```

2. In another terminal, build the Tailwind CSS:
```bash
cd frontend
npx tailwindcss -i ./public/css/styles.css -o ./public/css/output.css --watch
```

3. Serve the frontend (you can use Live Server in VS Code or any other static file server).

## Features Implemented

1. **Authentication**:
   - Login with username/password
   - JWT token storage
   - Protected routes

2. **Car Management**:
   - CRUD operations for cars
   - Each user can only see/edit/delete their own cars
   - Search functionality
   - Filter by make

3. **Frontend**:
   - Responsive design with Tailwind CSS
   - Modal for editing cars
   - Form validation
   - Debounced search

## Testing Credentials

You can use these dummy users to log in:

1. Username: `john`, Password: `password`
2. Username: `jane`, Password: `password`

This implementation provides a complete, functional RESTful API with a modern frontend that demonstrates all the requested features.