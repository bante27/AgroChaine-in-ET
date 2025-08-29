import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react';

const ProductsDisplay = ({ products, viewMode, page, totalPages, onPageChange, onProductClick, onAddToCart, onBuyNow }) => {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {products.length} Products Found
          </h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="small"
              disabled={page === 1}
              onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
              className="rounded-xl"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
            <Button
              variant="outline"
              size="small"
              disabled={page === totalPages}
              onClick={() => onPageChange(prev => Math.min(prev + 1, totalPages))}
              className="rounded-xl"
            >
              Next
            </Button>
          </div>
        </div>

        {/* Empty state */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-inner">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
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
    </section>
  );
};

export default ProductsDisplay;
