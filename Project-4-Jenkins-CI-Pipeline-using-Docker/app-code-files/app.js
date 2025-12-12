// Import express
const express = require('express');

// Initialize express app
const app = express();

// Define a simple endpoint
app.get('/api/', (req, res) => {
  res.json({ message: 'Welcome to api' });
});

app.get('/api/greet', (req, res) => {
  res.json({ message: 'Hello, welcome to the Express API!' });
});

app.get('/api/welcome', (req, res) => {
  res.json({ message: 'Welcome!' });
});

// Set the port
const port = 50000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
