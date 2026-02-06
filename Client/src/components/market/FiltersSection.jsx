import React from 'react';
import { Search, Grid, List } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

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
  const { t } = useLanguage();
  return (
    <section className="py-8 bg-white backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Input */}
          <div className="flex-1 max-w-md w-full">
            <div className="relative flex shadow-sm rounded-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder={t('marketplace.filters.search')}
                value={inputValue}
                onChange={onSearchChange}
                onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                ref={searchInputRef}
                className="w-full pl-11 pr-24 py-3 sm:py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#046A38] focus:border-transparent transition-all text-base sm:text-sm shadow-sm"
              />
              <button
                onClick={onSearchSubmit}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#046A38] text-white rounded-lg hover:bg-[#03542c] font-medium text-sm transition-colors shadow-sm"
              >
                {t('marketplace.filters.searchBtn')}
              </button>
            </div>
          </div>

          {/* Filters and View Mode */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="grid grid-cols-1 sm:flex gap-3 w-full">
              <select
                value={selectedCategory}
                onChange={onCategoryChange}
                className="w-full sm:w-auto px-4 py-3 sm:py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-[#046A38] focus:border-transparent text-base sm:text-sm appearance-none shadow-sm cursor-pointer hover:border-gray-300 transition-colors"
                style={{ backgroundImage: 'none' }} // Remove default arrow to style cleaner if needed
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
                className="w-full sm:w-auto px-4 py-3 sm:py-2.5 border border-gray-200 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-[#046A38] focus:border-transparent text-base sm:text-sm appearance-none shadow-sm cursor-pointer hover:border-gray-300 transition-colors"
              >
                <option value="price-low">{t('marketplace.filters.sort.priceLow')}</option>
                <option value="price-high">{t('marketplace.filters.sort.priceHigh')}</option>
                <option value="newest">{t('marketplace.filters.sort.newest')}</option>
                <option value="rating">{t('marketplace.filters.sort.rating')}</option>
              </select>
            </div>

            <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-1 gap-1 shrink-0">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-2.5 sm:p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-[#046A38] shadow-sm ring-1 ring-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-2.5 sm:p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-[#046A38] shadow-sm ring-1 ring-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
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
