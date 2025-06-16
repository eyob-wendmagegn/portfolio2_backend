import express from 'express';
import About from '../models/About.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const aboutData = await About.findOne();
  res.json(aboutData || { content: '' });
});

export default router;