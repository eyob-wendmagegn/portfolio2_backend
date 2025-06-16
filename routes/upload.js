import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const fileSchema = new mongoose.Schema({
  filename: String,
  path: String,
  uploadedAt: { type: Date, default: Date.now }
});

const Image = mongoose.model('storeImages', fileSchema);
const Document = mongoose.model('storeDocuments', fileSchema);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload routes
router.post('/storeImages', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
  try {
    const newImage = new Image({
      filename: req.file.filename,
      path: req.file.path
    });
    await newImage.save();
    res.json({ success: true, file: { filename: req.file.filename, path: req.file.path } });
  } catch (err) {
    console.error('Error saving image:', err);
    res.status(500).json({ success: false, error: 'Failed to save image' });
  }
});

router.post('/storeDocuments', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
  try {
    const newDocument = new Document({
      filename: req.file.filename,
      path: req.file.path
    });
    await newDocument.save();
    res.json({ success: true, file: { filename: req.file.filename, path: req.file.path } });
  } catch (err) {
    console.error('Error saving document:', err);
    res.status(500).json({ success: false, error: 'Failed to save document' });
  }
});

router.get('/files', async (req, res) => {
  try {
    const images = await Image.find().lean();
    const documents = await Document.find().lean();
    console.log('Fetched files:', [...images, ...documents]); // Debug log
    res.json({ success: true, files: [...images, ...documents] });
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch files' });
  }
});

router.delete('/delete/:filename', async (req, res) => {
  const { filename } = req.params;
  try {
    const image = await Image.findOneAndDelete({ filename });
    if (image) {
      fs.unlinkSync(path.join(process.cwd(), 'uploads', filename));
      return res.json({ success: true, message: 'Image deleted' });
    }
    const document = await Document.findOneAndDelete({ filename });
    if (document) {
      fs.unlinkSync(path.join(process.cwd(), 'uploads', filename));
      return res.json({ success: true, message: 'Document deleted' });
    }
    res.status(404).json({ success: false, error: 'File not found' });
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ success: false, error: 'Failed to delete file' });
  }
});

export default router;