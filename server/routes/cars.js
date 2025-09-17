import express from 'express';
import {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  uploadCarModel,
} from '../controllers/carController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.route('/')
  .get(getCars)
  .post(protect, createCar);

router.route('/:id')
  .get(getCar)
  .put(protect, updateCar)
  .delete(protect, deleteCar);

router.route('/:id/upload')
  .put(protect, upload.single('model3D'), uploadCarModel);

export default router;