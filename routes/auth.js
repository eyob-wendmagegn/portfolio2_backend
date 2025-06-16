import express from 'express';
const router = express.Router();

// Mock login endpoint (replace with actual authentication logic)
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });

  // Simple mock authentication (replace with real user validation)
  if (email === 'eyobwende18@gmail.com' && password === 'eyob1212') {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

export default router;