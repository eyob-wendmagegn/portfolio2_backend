import mongoose from 'mongoose';

const storeImagesSchema = new mongoose.Schema({
  filename: String,
  path: String
});

export default mongoose.model('storeImages', storeImagesSchema);