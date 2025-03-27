# Node.js Express RESTful API with Frontend

I'll create a simple project with a Node.js Express backend that serves both a RESTful API and a frontend to interact with it. The API will handle user data with CRUD operations (Create, Read, Update, Delete) using dummy data.

## Project Structure

```
user-api/
├── server.js          # Main server file
├── package.json
├── public/            # Frontend files
│   ├── index.html
│   ├── style.css
│   └── script.js
└── users.js           # Dummy data and helper functions
```

## Step 1: Initialize the Project

1. Create a new directory and initialize a Node.js project:
```bash
mkdir user-api
cd user-api
npm init -y
```

2. Install required dependencies:
```bash
npm install express body-parser
```

## Step 2: Create the Backend

### server.js
```javascript
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('./users');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes
app.get('/api/users', (req, res) => {
    res.json(getUsers());
});

app.get('/api/users/:id', (req, res) => {
    const user = getUserById(parseInt(req.params.id));
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.post('/api/users', (req, res) => {
    const newUser = createUser(req.body);
    res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
    const updatedUser = updateUser(parseInt(req.params.id), req.body);
    if (updatedUser) {
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

app.delete('/api/users/:id', (req, res) => {
    const deletedUser = deleteUser(parseInt(req.params.id));
    if (deletedUser) {
        res.json({ message: 'User deleted successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
```

### users.js (Dummy data and helper functions)
```javascript
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
];

let nextId = 4;

function getUsers() {
    return users;
}

function getUserById(id) {
    return users.find(user => user.id === id);
}

function createUser(userData) {
    const newUser = { id: nextId++, ...userData };
    users.push(newUser);
    return newUser;
}

function updateUser(id, userData) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        return users[userIndex];
    }
    return null;
}

function deleteUser(id) {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
        const deletedUser = users[userIndex];
        users = users.filter(user => user.id !== id);
        return deletedUser;
    }
    return null;
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};
```

## Step 3: Create the Frontend

### public/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Management</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>User Management</h1>
        
        <div class="section">
            <h2>Create User</h2>
            <form id="createForm">
                <input type="text" id="name" placeholder="Name" required>
                <input type="email" id="email" placeholder="Email" required>
                <button type="submit">Create</button>
            </form>
        </div>
        
        <div class="section">
            <h2>All Users</h2>
            <div id="usersList"></div>
        </div>
        
        <div class="section">
            <h2>Update User</h2>
            <form id="updateForm">
                <input type="number" id="updateId" placeholder="User ID" required>
                <input type="text" id="updateName" placeholder="New Name">
                <input type="email" id="updateEmail" placeholder="New Email">
                <button type="submit">Update</button>
            </form>
        </div>
        
        <div class="section">
            <h2>Delete User</h2>
            <form id="deleteForm">
                <input type="number" id="deleteId" placeholder="User ID" required>
                <button type="submit">Delete</button>
            </form>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>
```

### public/style.css
```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f5f5f5;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1, h2 {
    color: #333;
}

.section {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

form {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 15px;
}

input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    flex-grow: 1;
}

button {
    padding: 8px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #45a049;
}

#usersList {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
}

.user-card {
    border: 1px solid #ddd;
    padding: 15px;
    border-radius: 5px;
    background-color: #f9f9f9;
}

.user-card h3 {
    margin-top: 0;
    color: #333;
}

.user-card p {
    margin-bottom: 5px;
    color: #666;
}
```

### public/script.js
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const usersList = document.getElementById('usersList');
    const createForm = document.getElementById('createForm');
    const updateForm = document.getElementById('updateForm');
    const deleteForm = document.getElementById('deleteForm');
    
    // Fetch and display all users
    function fetchUsers() {
        fetch('/api/users')
            .then(response => response.json())
            .then(users => {
                usersList.innerHTML = '';
                users.forEach(user => {
                    const userCard = document.createElement('div');
                    userCard.className = 'user-card';
                    userCard.innerHTML = `
                        <h3>${user.name}</h3>
                        <p>ID: ${user.id}</p>
                        <p>Email: ${user.email}</p>
                    `;
                    usersList.appendChild(userCard);
                });
            })
            .catch(error => console.error('Error fetching users:', error));
    }
    
    // Create a new user
    createForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        
        fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email }),
        })
        .then(response => response.json())
        .then(() => {
            fetchUsers();
            createForm.reset();
        })
        .catch(error => console.error('Error creating user:', error));
    });
    
    // Update a user
    updateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('updateId').value;
        const name = document.getElementById('updateName').value;
        const email = document.getElementById('updateEmail').value;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        
        if (Object.keys(updateData).length === 0) {
            alert('Please provide at least one field to update');
            return;
        }
        
        fetch(`/api/users/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(() => {
            fetchUsers();
            updateForm.reset();
        })
        .catch(error => {
            console.error('Error updating user:', error);
            alert(error.message);
        });
    });
    
    // Delete a user
    deleteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const id = document.getElementById('deleteId').value;
        
        fetch(`/api/users/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(() => {
            fetchUsers();
            deleteForm.reset();
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            alert(error.message);
        });
    });
    
    // Initial fetch
    fetchUsers();
});
```

## Step 4: Run the Application

1. Add a start script to your package.json:
```json
"scripts": {
    "start": "node server.js"
}
```

2. Start the server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:3000
```

## Features

1. **Create User**: Add new users with name and email
2. **View All Users**: See a list of all users in the system
3. **Update User**: Modify existing users by their ID
4. **Delete User**: Remove users by their ID

The application runs on a single server (port 3000) and serves both the API and frontend. The backend uses in-memory dummy data for demonstration purposes.

You can test the API directly using tools like Postman or cURL with these endpoints:
- GET `/api/users` - Get all users
- GET `/api/users/:id` - Get a specific user
- POST `/api/users` - Create a new user
- PUT `/api/users/:id` - Update a user
- DELETE `/api/users/:id` - Delete a user