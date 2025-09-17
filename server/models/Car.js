import mongoose from 'mongoose';

const SpecsSchema = new mongoose.Schema({
  engine: { type: String, trim: true },
  transmission: { type: String, trim: true },
  fuelType: { 
    type: String, 
    enum: ['petrol', 'diesel', 'electric', 'hybrid', 'other'], 
    default: 'petrol' 
  },
  horsepower: { type: Number, min: 0 },
  torqueNm: { type: Number, min: 0 },
}, { _id: false });

const CarSchema = new mongoose.Schema({
  make: { 
    type: String, 
    required: true, 
    trim: true, 
    index: true 
  },
  model: { 
    type: String, 
    required: true, 
    trim: true, 
    index: true 
  },
  features: [{ 
    type: String, 
    trim: true 
  }],
  trim: { 
    type: String, 
    trim: true 
  },
  year: { 
    type: Number, 
    required: true, 
    min: 1886 
  },
  vin: { 
    type: String, 
    unique: true, 
    sparse: true, 
    trim: true 
  },
  color: { 
    type: String, 
    trim: true 
  },
  mileage: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  specs: SpecsSchema,
  model3DUrl: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    min: 0 
  },
  discountPrice: { 
    type: Number, 
    min: 0 
  },
  currency: { 
    type: String, 
    default: 'USD' 
  },
  status: { 
    type: String, 
    enum: ['available', 'reserved', 'sold', 'maintenance'], 
    default: 'available' 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  averageRating: { 
    type: Number, 
    min: 0, 
    max: 5 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Car', CarSchema);