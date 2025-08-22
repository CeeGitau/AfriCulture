const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve the uploads folder 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to AfriConnect backend!');
});

// DB connection and server start
mongoose.connect(process.env.MONGO_URI)
        .then(() => {app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));})
        .catch(err => console.log(err));