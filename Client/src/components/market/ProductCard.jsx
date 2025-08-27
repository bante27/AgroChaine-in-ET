import React from 'react';
import { MapPin, Star, Eye, ShoppingCart } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const ProductCard = ({ product, viewMode, onClick, onAddToCart, onBuyNow }) => {
  return (
    <Card
      hover
      className={`h-full flex flex-col transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg
        bg-white
        border border-gray-200 rounded-xl
        ${viewMode === 'list' ? 'md:flex-row' : ''}
      `}
      style={{
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      {/* Image */}
      <div className={`${viewMode === 'list' ? 'md:flex-shrink-0 md:w-48' : ''}`}>
        <div
          className="relative w-full overflow-hidden"
          style={{
            border: '1px solid #e5e7eb',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '0.5rem',
          }}
        >
          <img
            src={
              product.images && product.images.length > 0
                ? `http://localhost:5000${product.images[0]}`
                : 'https://via.placeholder.com/300/000000/ffffff?text=No+Image'
            }
            alt={product.title}
            className={`w-full object-cover transition-shadow duration-300 ease-in-out
              ${viewMode === 'list' ? 'h-32 md:h-48' : 'h-48'}`}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300/000000/ffffff?text=No+Image';
            }}
            style={{ boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)' }}
          />
          {product.verified && (
            <div
              className="absolute top-2 left-2 text-xs font-semibold tracking-wider uppercase"
              style={{
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                userSelect: 'none',
              }}
            >
              Verified
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className={`flex-1 mt-4 ${viewMode === 'list' ? 'md:ml-6 md:mt-0' : ''} flex flex-col justify-between`}
        style={{
          color: '#333',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {/* Title & Rating */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3
              className="text-lg font-semibold line-clamp-2"
              style={{ color: '#1a202c' }}
            >
              {product.title}
            </h3>
            <div className="flex items-center space-x-1 select-none">
              <Star
                className="h-4 w-4 text-yellow-400 fill-current"
                style={{ filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.2))' }}
              />
              <span className="text-sm text-gray-600">
                {product.rating || '0'} ({product.reviews?.length || 0})
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 mb-2 text-sm text-gray-600 select-none">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{product.originAddress || 'Unknown Location'}</span>
          </div>

          {/* Seller */}
          <p className="text-sm mb-3" style={{ color: '#718096' }}>
            by{' '}
            <span className="font-medium" style={{ color: '#4a5568' }}>
              {product.ownerName || 'Unknown Seller'}
            </span>
          </p>
        </div>

        {/* Price & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-auto">
          <div>
            <span
              className="text-2xl font-bold"
              style={{ color: '#2d3748' }}
            >
              {product.price ? `${product.price} ETB` : 'N/A'}
            </span>
            <span className="text-gray-600 ml-1 text-sm select-none">per kg</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <Button
              variant="outline"
              size="small"
              onClick={onClick}
              className="flex items-center gap-1 px-4 py-2 text-sm transition-all duration-300 ease-in-out border-gray-300 text-gray-700 bg-white hover:bg-blue-100 hover:text-blue-700"
              style={{
                borderRadius: '0.75rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
              }}
            >
              <Eye className="h-4 w-4" /> View
            </Button>

            <Button
              size="small"
              onClick={() => onAddToCart(product)}
              disabled={product.quantity <= 0}
              className={`flex items-center gap-1 px-4 py-2 text-sm transition-all duration-300 ease-in-out ${
                product.quantity <= 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              style={{
                background: product.quantity > 0
                  ? 'linear-gradient(45deg, #4a90e2, #50e3c2)'
                  : '#e2e8f0',
                color: product.quantity > 0 ? 'white' : '#4a5568',
                borderRadius: '0.75rem',
                boxShadow: product.quantity > 0
                  ? '0 4px 12px rgba(74,144,226,0.2)'
                  : '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.1)',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                if (product.quantity > 0) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 15px rgba(74,144,226,0.3)';
                  e.currentTarget.style.background = 'linear-gradient(45deg, #357abd, #2ecc71)';
                }
              }}
              onMouseLeave={(e) => {
                if (product.quantity > 0) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(74,144,226,0.2)';
                  e.currentTarget.style.background = 'linear-gradient(45deg, #4a90e2, #50e3c2)';
                }
              }}
            >
              <ShoppingCart className="h-4 w-4" /> {product.quantity > 0 ? 'Add' : 'Add to Cart'}
            </Button>

            <Button
              size="small"
              onClick={() => onBuyNow(product)}
              disabled={product.quantity <= 0}
              className={`flex items-center gap-1 px-4 py-2 text-sm transition-all duration-300 ease-in-out ${
                product.quantity <= 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              style={{
                background: product.quantity > 0
                  ? 'linear-gradient(45deg, #e74c3c, #e67e22)'
                  : '#e2e8f0',
                color: product.quantity > 0 ? 'white' : '#4a5568',
                borderRadius: '0.75rem',
                boxShadow: product.quantity > 0
                  ? '0 4px 12px rgba(231,76,60,0.2)'
                  : '0 2px 4px rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.1)',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                if (product.quantity > 0) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 6px 15px rgba(231,76,60,0.3)';
                  e.currentTarget.style.background = 'linear-gradient(45deg, #c0392b, #d35400)';
                }
              }}
              onMouseLeave={(e) => {
                if (product.quantity > 0) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(231,76,60,0.2)';
                  e.currentTarget.style.background = 'linear-gradient(45deg, #e74c3c, #e67e22)';
                }
              }}
            >
              Buy
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;