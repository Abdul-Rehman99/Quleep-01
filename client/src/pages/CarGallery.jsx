import { useState, useMemo, useEffect } from 'react';
import { useCars } from '../hooks/useCars';
import { useDebounce } from '../hooks/useDebounce';
import CarCard from '../components/CarCard';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';

const CarGallery = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({});
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  const { cars, loading, error, pagination, changePage, fetchCars } = useCars();

  // Fetch cars when search query or filters change
  useEffect(() => {
    const params = {
      keyword: debouncedSearchQuery,
      ...appliedFilters,
      page: pagination.page,
      limit: pagination.limit
    };
    
    fetchCars(params);
  }, [debouncedSearchQuery, appliedFilters, pagination.page, pagination.limit, fetchCars]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters) => {
    // Convert filter arrays to query parameters
    const filterParams = {};
    
    Object.entries(newFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        filterParams[key] = values.join(',');
      }
    });
    
    setAppliedFilters(filterParams);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Car Gallery</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our collection of premium vehicles with interactive 3D views
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters */}
          <aside className="lg:w-1/4">
            <div className="sticky top-4">
              <div className="mb-6">
                <SearchBar 
                  onSearch={handleSearch} 
                  placeholder="Search by make, model, or trim..." 
                />
              </div>
              <FilterSidebar 
                onFilterChange={handleFilterChange}
                cars={cars}
              />
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-between items-center">
                  <p className="text-gray-600">
                    Showing {cars.length} of {pagination.total} cars
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cars.map((car) => (
                    <CarCard key={car._id} car={car} />
                  ))}
                </div>

                {cars.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold text-gray-600">No cars found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </div>
                )}

                {pagination.pages > 1 && (
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.pages}
                    onPageChange={changePage}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CarGallery;