import router from './routes/bikeRoutes.js';
import connectDB from './config/db.js';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });


const app = express();
const PORT = process.env.PORT;

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/api/upload', upload.single('image'), async (req, res) => {
  try{
      if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

  const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

  const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: 'home', 
      resource_type: 'auto',
    });

    return res.status(200).json({
      message: 'Upload successful',
      url: uploadResponse.secure_url, 
    });
  } catch(err){
    return res.status(500).json({ message: err.message });
  }

});

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
