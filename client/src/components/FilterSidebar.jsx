import { useState } from 'react';

const FilterSidebar = ({ onFilterChange, cars }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    make: [],
    year: [],
    fuelType: [],
    status: []
  });

  // Extract unique values for each filter category from the cars data
  const filterOptions = {
    make: [...new Set(cars.map(car => car.make))].sort(),
    year: [...new Set(cars.map(car => car.year))].sort((a, b) => b - a),
    fuelType: [...new Set(cars.map(car => car.specs?.fuelType).filter(Boolean))].sort(),
    status: [...new Set(cars.map(car => car.status))].sort()
  };

  const handleFilterChange = (filterType, value, isChecked) => {
    const newFilters = { ...selectedFilters };
    
    if (isChecked) {
      newFilters[filterType] = [...newFilters[filterType], value];
    } else {
      newFilters[filterType] = newFilters[filterType].filter(item => item !== value);
    }
    
    setSelectedFilters(newFilters);
    // Call the parent callback with updated filters
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      make: [],
      year: [],
      fuelType: [],
      status: []
    };
    setSelectedFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  // Count how many cars match each filter option
  const countOptions = (filterType, value) => {
    return cars.filter(car => {
      if (filterType === 'fuelType') {
        return car.specs?.[filterType] === value;
      }
      return car[filterType] === value;
    }).length;
  };

  return (
    <div className="w-64 bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button 
          onClick={clearFilters}
          className="text-sm text-primary-500 hover:text-primary-700"
        >
          Clear All
        </button>
      </div>
      
      {Object.entries(filterOptions).map(([filterType, options]) => (
        options.length > 0 && (
          <div key={filterType} className="mb-6">
            <h3 className="font-medium mb-3 capitalize">
              {filterType === 'fuelType' ? 'Fuel Type' : filterType}
            </h3>
            <div className="space-y-2">
              {options.map((option) => (
                <label key={option} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedFilters[filterType].includes(option)}
                      onChange={(e) => handleFilterChange(filterType, option, e.target.checked)}
                      className="rounded text-primary-500 focus:ring-primary-500 mr-2"
                    />
                    <span className="text-sm">
                      {option}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    ({countOptions(filterType, option)})
                  </span>
                </label>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default FilterSidebar;