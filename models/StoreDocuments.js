import mongoose from 'mongoose';

const storeDocumentsSchema = new mongoose.Schema({
  filename: String,
  path: String
});

export default mongoose.model('storeDocuments', storeDocumentsSchema);