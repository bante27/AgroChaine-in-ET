import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const ProductsDisplay = ({
  products,
  totalItems, // New prop
  viewMode,
  page,
  totalPages,
  onPageChange,
  onProductClick,
  onAddToCart,
  onBuyNow,
}) => {
  const { t } = useLanguage();

  // Check if all products are sold out
  const allSoldOut = products.length > 0 && products.every(p => p.quantity === 0);

  return (
    <section className="section-padding text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 shadow-text text-center md:text-left">
            {totalItems > 0 ? `${totalItems} ${t('marketplace.productsFound')}` : t('marketplace.noProductsFound')}
          </h2>
          <div className="flex items-center justify-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              size="small"
              disabled={page === 1}
              onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
              className="rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors text-blue-600 border-teal-300"
            >
              {t('marketplace.pagination.previous')}
            </Button>
            <span className="text-sm md:text-base text-blue-600">
              {t('marketplace.pagination.page')} {page} {t('marketplace.pagination.of')} {totalPages}
            </span>
            <Button
              variant="outline"
              size="small"
              disabled={page === totalPages}
              onClick={() => onPageChange(prev => Math.min(prev + 1, totalPages))}
              className="rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors text-blue-600 border-teal-300"
            >
              {t('marketplace.pagination.next')}
            </Button>
          </div>
        </div>

        {/* All Sold Out message */}
        {allSoldOut && (
          <div className="text-center text-red-600 font-bold text-xl mb-6">
            {t('marketplace.allSoldOut')}
          </div>
        )}

        {/* Empty state */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl shadow-xl backdrop-blur-md">
            <Search className="h-16 w-16 text-teal-300 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg md:text-xl font-medium text-blue-600 mb-2">{t('marketplace.noProductsFound')}</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <motion.div
            layout
            className={`grid gap-6 ${viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
              }`}
          >
            {products.map((product, index) => (
              <motion.div
                key={product._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                layout
                whileHover={{ scale: 1.03, transition: { duration: 0.3 } }}
                className="hover:shadow-2xl rounded-xl overflow-hidden"
              >
                <ProductCard
                  product={product}
                  viewMode={viewMode}
                  soldOut={product.quantity === 0} // ✅ sold-out logic
                  onClick={() => onProductClick(product)}
                  onAddToCart={onAddToCart}
                  onBuyNow={onBuyNow}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Custom styles */}
      <style>
        {`
          .shadow-text {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          }
          .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }
          @media (max-width: 640px) {
            h2 {
              font-size: 1.25rem;
            }
            .grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>
    </section>
  );
};

export default ProductsDisplay;
// Marketplace translations updated
