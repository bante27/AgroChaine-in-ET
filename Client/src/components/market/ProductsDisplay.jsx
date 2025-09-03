import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react';

const ProductsDisplay = ({ products, viewMode, page, totalPages, onPageChange, onProductClick, onAddToCart, onBuyNow }) => {
  return (
    <section className="section-padding text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-teal-200 shadow-text">
            {products.length > 0 ? `${products.length} Products Found` : "No Products Found"}
          </h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="small"
              disabled={page === 1}
              onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
              className="rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors text-teal-200 border-teal-300"
            >
              Previous
            </Button>
            <span className="text-sm md:text-base text-gray-300">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="small"
              disabled={page === totalPages}
              onClick={() => onPageChange(prev => Math.min(prev + 1, totalPages))}
              className="rounded-xl bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors text-teal-200 border-teal-300"
            >
              Next
            </Button>
          </div>
        </div>

        {/* Empty state */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl shadow-xl backdrop-blur-md">
            <Search className="h-16 w-16 text-teal-300 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg md:text-xl font-medium text-teal-100 mb-2">No products found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <motion.div
            layout
            className={`grid gap-6 ${
              viewMode === 'grid'
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
