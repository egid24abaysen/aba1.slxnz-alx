const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Dummy data
let users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
];

// Routes
// Get all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Get single user by ID
app.get('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(user => user.id === id);
    
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Create a new user
app.post('/api/users', (req, res) => {
    const user = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };
    
    users.push(user);
    res.status(201).json(user);
});

// Update a user
app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex >= 0) {
        users[userIndex] = { ...users[userIndex], ...req.body };
        res.json(users[userIndex]);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Delete a user
app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex >= 0) {
        users.splice(userIndex, 1);
        res.json({ message: 'User deleted' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});