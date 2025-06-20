// require('dotenv').config();
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import uploadRoutes from './routes/upload.js';
import aboutRoutes from './routes/about.js';
import cors from 'cors';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/about', aboutRoutes);

app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  res.download(path.join(__dirname, 'uploads', filename), filename, (err) => {
    if (err) res.status(404).send('File not found');
  });
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));

if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'), { recursive: true });
}