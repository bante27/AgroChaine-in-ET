import React from 'react';
import { motion } from 'framer-motion';
import Card from '../common/Card';
import Button from '../common/Button';
import ProductCard from './ProductCard';
import { Search } from 'lucide-react'; // Added this line

const ProductsDisplay = ({ products, viewMode, page, totalPages, onPageChange, onProductClick, onAddToCart, onBuyNow }) => {
  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {products.length} Products Found
          </h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="small"
              disabled={page === 1}
              onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 self-center">Page {page} of {totalPages}</span>
            <Button
              variant="outline"
              size="small"
              disabled={page === totalPages}
              onClick={() => onPageChange(prev => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {products.map((product, index) => (
              <motion.div
                key={product._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
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
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsDisplay;