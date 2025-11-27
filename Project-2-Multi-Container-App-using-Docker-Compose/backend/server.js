require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files (optional) from ../frontend
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/simple_auth_db';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Simple health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Register endpoint: accepts form-urlencoded or JSON body { username, password }
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });

    // Create the user document (collection will be created if not exists)
    const user = new User({ username, password });
    await user.save();

    res.json({ message: 'User saved', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
});

// Endpoint to fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username password'); // Fetch username and password only
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
