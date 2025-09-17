import asyncHandler from 'express-async-handler';
import Car from '../models/Car.js';
import APIFeatures from '../utils/apiFeatures.js';
import { cloudinary } from '../config/cloudinary.js';

// @desc    Get all cars
// @route   GET /api/cars
// @access  Public
const getCars = asyncHandler(async (req, res) => {
  const features = new APIFeatures(Car.find(), req.query)
    .search()
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const cars = await features.query.populate('owner', 'name email');
  const count = await Car.countDocuments();
  
  res.status(200).json({
    success: true,
    count: count,
    data: cars,
  });
});

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
const getCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id).populate('owner', 'name email');

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  res.status(200).json({
    success: true,
    data: car,
  });
});

// @desc    Create new car
// @route   POST /api/cars
// @access  Private
const createCar = asyncHandler(async (req, res) => {
  // Add user to req.body
  req.body.owner = req.user.id;
  
  const car = await Car.create(req.body);

  res.status(201).json({
    success: true,
    data: car,
  });
});

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private
const updateCar = asyncHandler(async (req, res) => {
  let car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  // Make sure user is car owner or admin
  if (car.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this car');
  }

  car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: car,
  });
});

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Private
const deleteCar = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  // Make sure user is car owner or admin
  if (car.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to delete this car');
  }

  // If car has a 3D model, delete it from Cloudinary
  // if (car.model3DUrl) {
  //   const publicId = car.model3DUrl.split('/').pop().split('.')[0];
  //   await cloudinary.uploader.destroy(`car-models/${publicId}`, {
  //     resource_type: 'raw',
  //   });
  // }

  await car.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Upload 3D model for car
// @route   PUT /api/cars/:id/upload
// @access  Private
const uploadCarModel = asyncHandler(async (req, res) => {
  const car = await Car.findById(req.params.id);

  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  // Make sure user is car owner or admin
  if (car.owner.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(401);
    throw new Error('Not authorized to update this car');
  }

  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a file');
  }

  // If car already has a 3D model, delete the old one
  if (car.model3DUrl) {
    const publicId = car.model3DUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(`car-models/${publicId}`, {
      resource_type: 'raw',
    });
  }

  car.model3DUrl = req.file.path;
  await car.save();

  res.status(200).json({
    success: true,
    data: car,
  });
});

export {
  getCars,
  getCar,
  createCar,
  updateCar,
  deleteCar,
  uploadCarModel,
};