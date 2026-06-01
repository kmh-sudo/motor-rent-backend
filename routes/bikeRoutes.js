import { Router } from 'express';
import { createBike, getAllBikes, getRentalReport, updateBikeStatus, deleteBike } from '../controllers/bikeControllers.js';

const router = Router();

router.post('/api/bikes', createBike);
router.get('/api/bikes', getAllBikes);
router.get('/api/bikes/report', getRentalReport);
router.put('/api/bikes/:id', updateBikeStatus);
router.delete('/api/bikes/:id', deleteBike);

export default router;