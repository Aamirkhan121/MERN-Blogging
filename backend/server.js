require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const userRouter = require('./routes/userRoute');
const postRouter = require('./routes/postRoute');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use('/api/users', userRouter);
//create post route
    app.use('/api/posts', postRouter);
app.use("/uploads", express.static("uploads"));


// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/posts', require('./routes/posts'));   
// app.use('/api/users', require('./routes/users'));

// Connect to MongoDB   
mongoose.connect(MONGO_URI, {
}).then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

