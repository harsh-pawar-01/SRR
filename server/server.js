const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const feeRoutes = require('./routes/feeRoutes');

dotenv.config();
connectDB();

const app = express();

app.use(cors()); 
app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Academy API is running...');
});

// Mount Auth Routes
app.use('/api/auth', authRoutes);

app.use('/api/fees', feeRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
});