const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const secretKey = 'yourSecretKey'; // Replace with your secret key

// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization');
    
    if (token) {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Route to generate JWT token
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // For simplicity, we'll just check if username and password are not empty
    if (username && password) {
        const user = { username }; // In a real application, you'd verify user credentials here
        const token = jwt.sign({ user }, secretKey, { expiresIn: '1h' });

        res.json({ token });
    } else {
        res.sendStatus(400);
    }
});

// Protected route
app.get('/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
