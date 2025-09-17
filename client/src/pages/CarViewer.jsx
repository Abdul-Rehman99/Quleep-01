import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { carAPI } from '../services/api';
import ThreeJSViewer from '../components/ThreeJSViewer';

const CarViewer = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const response = await carAPI.getById(id);
        setCar(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600">{error || 'Car not found'}</p>
          <Link to="/" className="mt-4 inline-block px-6 py-2 bg-primary-500 text-white rounded">
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-primary-500 hover:text-primary-700 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 3D Viewer */}
          <div>
            <ThreeJSViewer 
              modelUrl={car.model3DUrl} 
              carDetails={car}
            />
          </div>

          {/* Car Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {car.make} {car.model}
            </h1>
            {car.trim && <p className="text-xl text-gray-600 mb-4">{car.trim}</p>}

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-3xl font-bold text-primary-600">
                    {formatPrice(car.discountPrice || car.price, car.currency)}
                  </p>
                  {car.discountPrice && (
                    <p className="text-lg text-gray-500 line-through">
                      {formatPrice(car.price, car.currency)}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  car.status === 'available' ? 'bg-green-100 text-green-800' :
                  car.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {car.status?.charAt(0).toUpperCase() + car.status?.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Year</h3>
                  <p className="text-lg">{car.year}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Mileage</h3>
                  <p className="text-lg">{car.mileage.toLocaleString()} km</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Color</h3>
                  <p className="text-lg capitalize">{car.color}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">VIN</h3>
                  <p className="text-lg font-mono">{car.vin}</p>
                </div>
              </div>

              {car.specs && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Engine</h4>
                      <p>{car.specs.engine}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Transmission</h4>
                      <p>{car.specs.transmission}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Fuel Type</h4>
                      <p className="capitalize">{car.specs.fuelType}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Horsepower</h4>
                      <p>{car.specs.horsepower} HP</p>
                    </div>
                    {car.specs.torqueNm && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Torque</h4>
                        <p>{car.specs.torqueNm} Nm</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {car.features && car.features.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarViewer;