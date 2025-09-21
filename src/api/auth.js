const express = require('express');
const router = express.Router();

// Basic auth endpoints for demonstration
// In a real application, you would integrate with a proper authentication system

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Mock authentication - replace with real authentication logic
    if (email === 'admin@example.com' && password === 'admin123') {
      const token = 'mock-jwt-token-' + Date.now();
      res.json({
        token,
        user: {
          id: 1,
          email: 'admin@example.com',
          name: 'System Administrator',
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role = 'team_member' } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Mock user creation - replace with real user creation logic
    const newUser = {
      id: Date.now(),
      name,
      email,
      role,
      created_at: new Date().toISOString()
    };

    const token = 'mock-jwt-token-' + Date.now();
    
    res.status(201).json({
      token,
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    // Mock user data - replace with real user lookup
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Mock token validation
    if (token.startsWith('mock-jwt-token-')) {
      res.json({
        user: {
          id: 1,
          email: 'admin@example.com',
          name: 'System Administrator',
          role: 'admin'
        }
      });
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  // In a real application, you might blacklist the token or clear session
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;