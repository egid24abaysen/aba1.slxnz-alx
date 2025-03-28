const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const carRoutes = require('./routes/carRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
// Add this after the other route imports


// Add this with the other app.use() calls
app.use('/api/users', userRoutes);

// Error handling
app.use(errorHandler);

const PORT = 9090;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});