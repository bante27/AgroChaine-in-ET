import React from 'react';
import { Search, Grid, List } from 'lucide-react';

const FiltersSection = ({
  inputValue,
  onSearchChange,
  onSearchSubmit,
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  searchInputRef,
}) => {
  return (
    <section className="py-8 bg-white backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Input */}
          <div className="flex-1 max-w-md">
            <div className="relative flex">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products or locations..."
                value={inputValue}
                onChange={onSearchChange}
                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                ref={searchInputRef}
                className="w-full pl-10 pr-24 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={onSearchSubmit}
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>

          {/* Filters and View Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <select
              value={selectedCategory}
              onChange={onCategoryChange}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={onSortChange}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FiltersSection;
