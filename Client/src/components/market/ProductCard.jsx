import React from 'react';
import { MapPin, Star, Eye, ShoppingCart } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const ProductCard = ({ product, viewMode, onClick, onAddToCart, onBuyNow }) => {
  return (
    <Card
      hover
      className={`h-full flex flex-col transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl
        bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
        border border-gray-700 rounded-xl
        ${viewMode === 'list' ? 'md:flex-row' : ''}
      `}
      style={{
        boxShadow: '4px 4px 12px rgba(0,0,0,0.8), inset 0 0 8px rgba(255,255,255,0.05)',
      }}
    >
      {/* Image */}
      <div className={`${viewMode === 'list' ? 'md:flex-shrink-0 md:w-48' : ''}`}>
        <div
          className="relative w-full overflow-hidden"
          style={{
            boxShadow: 'inset 0 0 10px rgba(255,255,255,0.1)',
            filter: 'grayscale(100%) contrast(120%) brightness(90%)',
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
            style={{ boxShadow: '0 0 14px rgba(255,255,255,0.1)' }}
          />
          {product.verified && (
            <div
              className="absolute top-2 left-2 text-xs font-semibold tracking-wider uppercase"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: 'white',
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
                boxShadow: '0 0 8px rgba(255,255,255,0.25)',
                userSelect: 'none',
                backdropFilter: 'blur(4px)',
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
          color: '#e0e0e0',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {/* Title & Rating */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3
              className="text-lg font-semibold line-clamp-2"
              style={{ color: 'white' }}
            >
              {product.title}
            </h3>
            <div className="flex items-center space-x-1 select-none">
              <Star
                className="h-4 w-4 text-gray-300 fill-current"
                style={{ filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.5))' }}
              />
              <span className="text-sm text-gray-400">
                {product.rating || '0'} ({product.reviews?.length || 0})
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 mb-2 text-sm text-gray-400 select-none">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{product.originAddress || 'Unknown Location'}</span>
          </div>

          {/* Seller */}
          <p className="text-sm mb-3" style={{ color: '#a0a0a0' }}>
            by{' '}
            <span className="font-medium" style={{ color: '#d0d0d0' }}>
              {product.ownerName || 'Unknown Seller'}
            </span>
          </p>
        </div>

        {/* Price & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-auto">
          <div>
            <span
              className="text-2xl font-bold"
              style={{ color: 'white' }}
            >
              {product.price ? `${product.price} ETB` : 'N/A'}
            </span>
            <span className="text-gray-400 ml-1 text-sm select-none">per kg</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <Button
              variant="outline"
              size="xs"
              onClick={onClick}
              className="flex items-center gap-1 px-2 py-1 text-sm sm:text-xs transition-colors duration-300 ease-in-out border-gray-400 text-gray-300 bg-transparent hover:bg-gray-700 hover:text-white"
              style={{
                borderRadius: '0.5rem',
                userSelect: 'none',
                boxShadow: '0 0 8px rgba(255,255,255,0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2d2d2d';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#d1d5db';
                e.currentTarget.style.boxShadow = '0 0 8px rgba(255,255,255,0.1)';
              }}
            >
              <Eye className="h-3 w-3" /> View
            </Button>

            <Button
              size="xs"
              onClick={() => onAddToCart(product)}
              disabled={product.quantity <= 0}
              className={`flex items-center gap-1 px-2 py-1 text-sm sm:text-xs transition-colors duration-300 ease-in-out ${
                product.quantity <= 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              style={{
                background: product.quantity > 0
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(50, 50, 50, 0.3)',
                color: product.quantity > 0 ? '#f0f0f0' : '#555',
                borderRadius: '0.5rem',
                boxShadow: product.quantity > 0
                  ? '0 0 10px rgba(255,255,255,0.2)'
                  : 'inset 2px 2px 4px rgba(0,0,0,0.5)',
                userSelect: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
              onMouseEnter={(e) => {
                if (product.quantity > 0) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(255,255,255,0.35)';
                  e.currentTarget.style.color = '#fff';
                }
              }}
              onMouseLeave={(e) => {
                if (product.quantity > 0) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(255,255,255,0.2)';
                  e.currentTarget.style.color = '#f0f0f0';
                }
              }}
            >
              <ShoppingCart className="h-3 w-3" /> {product.quantity > 0 ? 'Add' : 'Add to Cart'}
            </Button>

            <Button
              size="xs"
              onClick={() => onBuyNow(product)}
              disabled={product.quantity <= 0}
              className={`flex items-center gap-1 px-2 py-1 text-sm sm:text-xs transition-colors duration-300 ease-in-out ${
                product.quantity <= 0
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }`}
              style={{
                background: product.quantity > 0
                  ? 'linear-gradient(90deg, #444, #222)'
                  : 'rgba(70, 70, 70, 0.6)',
                color: 'white',
                borderRadius: '0.5rem',
                boxShadow: product.quantity > 0
                  ? '0 0 15px rgba(255,255,255,0.3)'
                  : 'inset 2px 2px 5px rgba(0,0,0,0.7)',
                userSelect: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
              onMouseEnter={(e) => {
                if (product.quantity > 0) {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #555, #333)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(255,255,255,0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (product.quantity > 0) {
                  e.currentTarget.style.background = 'linear-gradient(90deg, #444, #222)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(255,255,255,0.3)';
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
