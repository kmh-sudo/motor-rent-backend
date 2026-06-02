import { Router } from 'express';
import multer from 'multer';
import { createBike, getAllBikes, getRentalReport, updateBikeStatus, deleteBike } from '../controllers/bikeControllers.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/api/bikes', upload.single('image'), createBike);
router.get('/api/bikes', getAllBikes);
router.get('/api/bikes/report', getRentalReport);
router.put('/api/bikes/:id', updateBikeStatus);
router.delete('/api/bikes/:id', deleteBike);

export default router;



