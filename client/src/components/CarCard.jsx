import { Link } from 'react-router-dom';

const CarCard = ({ car }) => {
  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <Link to={`/car/${car._id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-xl group-hover:scale-105">
        <div className="h-48 bg-gray-200 relative">
          {car.model3DUrl ? (
            <img
              src="/placeholder-car.jpg" // You might want to use a placeholder or generate thumbnails
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
          <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded text-sm">
            {car.status}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {car.make} {car.model}
          </h3>
          {car.trim && <p className="text-gray-600">{car.trim}</p>}
          
          <div className="mt-2">
            <p className="text-2xl font-bold text-primary-600">
              {formatPrice(car.discountPrice || car.price, car.currency)}
            </p>
            {car.discountPrice && (
              <p className="text-sm text-gray-500 line-through">
                {formatPrice(car.price, car.currency)}
              </p>
            )}
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Year:</span> {car.year}
            </div>
            <div>
              <span className="text-gray-600">Mileage:</span> {car.mileage.toLocaleString()} km
            </div>
            {car.specs && (
              <>
                <div>
                  <span className="text-gray-600">Engine:</span> {car.specs.engine}
                </div>
                <div>
                  <span className="text-gray-600">HP:</span> {car.specs.horsepower}
                </div>
              </>
            )}
          </div>
          
          {car.features && car.features.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {car.features.slice(0, 3).map((feature, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                  >
                    {feature}
                  </span>
                ))}
                {car.features.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{car.features.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CarCard;