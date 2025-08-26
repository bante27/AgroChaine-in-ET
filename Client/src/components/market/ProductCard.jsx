import React from 'react';
import { MapPin, Star, Eye, ShoppingCart } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const ProductCard = ({ product, viewMode, onClick, onAddToCart, onBuyNow }) => {
  return (
    <Card
      hover
      className={`h-full flex flex-col transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg
        bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100
        border border-slate-300 rounded-xl
        ${viewMode === 'list' ? 'md:flex-row' : ''}
      `}
      style={{
        boxShadow: '4px 4px 8px rgba(143,155,179,0.1), inset 0 0 6px rgba(255,255,255,0.7)',
      }}
    >
      {/* Image */}
      <div className={`${viewMode === 'list' ? 'md:flex-shrink-0 md:w-48' : ''}`}>
        <div
          className="relative w-full rounded-lg overflow-hidden"
          style={{
            boxShadow: 'inset 0 0 8px rgba(255,255,255,0.6)',
            borderRadius: '1rem',
          }}
        >
          <img
            src={
              product.images && product.images.length > 0
                ? `http://localhost:5000${product.images[0]}`
                : 'https://via.placeholder.com/300'
            }
            alt={product.title}
            className={`w-full object-cover rounded-lg transition-shadow duration-300 ease-in-out
              ${viewMode === 'list' ? 'h-32 md:h-48' : 'h-48'}`}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300';
            }}
            style={{ boxShadow: '0 0 10px rgba(81,120,199,0.15)' }}
          />
          {product.verified && (
            <div
              className="absolute top-2 left-2 text-xs font-semibold"
              style={{
                backgroundColor: '#10b981', // emerald-600
                color: 'white',
                padding: '0.2rem 0.5rem',
                borderRadius: '9999px',
                boxShadow: '0 0 6px rgba(16,185,129,0.6)',
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
          color: '#344054',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {/* Title & Rating */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3
              className="text-lg font-semibold line-clamp-2"
              style={{ color: '#1e293b' }}
            >
              {product.title}
            </h3>
            <div className="flex items-center space-x-1 select-none">
              <Star
                className="h-4 w-4 text-yellow-400 fill-current"
                style={{ filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.12))' }}
              />
              <span className="text-sm text-gray-600">
                {product.rating || '0'} ({product.reviews?.length || 0})
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 mb-2 text-sm text-gray-600 select-none">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{product.originAddress || 'Unknown Location'}</span>
          </div>

          {/* Seller */}
          <p className="text-sm mb-3" style={{ color: '#475569' }}>
            by{' '}
            <span className="font-medium" style={{ color: '#334155' }}>
              {product.ownerName || 'Unknown Seller'}
            </span>
          </p>
        </div>

        {/* Price & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-auto">
          <div>
            <span
              className="text-2xl font-bold"
              style={{ color: '#059669' }} // emerald-600
            >
              {product.price ? `${product.price} ETB` : 'N/A'}
            </span>
            <span className="text-gray-500 ml-1 text-sm select-none">per kg</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <Button
              variant="outline"
              size="xs"
              onClick={onClick}
              className="flex items-center gap-1 px-2 py-1 text-sm sm:text-xs transition-colors duration-300 ease-in-out"
              style={{
                borderColor: '#a3bffa',
                color: '#3b82f6',
                background: 'linear-gradient(145deg, #e6edff, #c5d6ff)',
                boxShadow:
                  '6px 6px 8px #bac8f3, -6px -6px 8px #f4f8ff',
                borderRadius: '0.5rem',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(145deg, #c5d6ff, #a3bffa)';
                e.currentTarget.style.color = '#1e40af';
                e.currentTarget.style.boxShadow =
                  'inset 2px 2px 4px #94a3b8, inset -2px -2px 4px #e0e7ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(145deg, #e6edff, #c5d6ff)';
                e.currentTarget.style.color = '#3b82f6';
                e.currentTarget.style.boxShadow =
                  '6px 6px 8px #bac8f3, -6px -6px 8px #f4f8ff';
              }}
            >
              <Eye className="h-3 w-3" /> View
            </Button>

            <Button
              size="xs"
              onClick={() => onAddToCart(product)}
              disabled={product.quantity <= 0}
              className="flex items-center gap-1 px-2 py-1 text-sm sm:text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 ease-in-out"
              style={{
                background: product.quantity > 0
                  ? 'linear-gradient(145deg, #e0f2f1, #b2dfdb)'
                  : 'linear-gradient(145deg, #f0f0f0, #d9d9d9)',
                color: product.quantity > 0 ? '#00796b' : '#757575',
                borderRadius: '0.5rem',
                boxShadow: product.quantity > 0
                  ? '6px 6px 8px #a7c4bf, -6px -6px 8px #e2f0ec'
                  : 'inset 3px 3px 6px #bebebe, inset -3px -3px 6px #ffffff',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                if (product.quantity > 0) {
                  e.currentTarget.style.background = 'linear-gradient(145deg, #b2dfdb, #80cbc4)';
                  e.currentTarget.style.boxShadow = 'inset 2px 2px 6px #8ac6b7, inset -2px -2px 6px #bff2e6';
                  e.currentTarget.style.color = '#004d40';
                }
              }}
              onMouseLeave={(e) => {
                if (product.quantity > 0) {
                  e.currentTarget.style.background = 'linear-gradient(145deg, #e0f2f1, #b2dfdb)';
                  e.currentTarget.style.boxShadow = '6px 6px 8px #a7c4bf, -6px -6px 8px #e2f0ec';
                  e.currentTarget.style.color = '#00796b';
                }
              }}
            >
              <ShoppingCart className="h-3 w-3" /> {product.quantity > 0 ? 'Add' : 'Out'}
            </Button>

            <Button
              size="xs"
              onClick={() => onBuyNow(product)}
              disabled={product.quantity <= 0}
              className="flex items-center gap-1 px-2 py-1 text-sm sm:text-xs transition-colors duration-300 ease-in-out"
              style={{
                background: product.quantity > 0
                  ? 'linear-gradient(145deg, #059669, #047857)'
                  : 'linear-gradient(145deg, #9ca3af, #6b7280)',
                color: 'white',
                borderRadius: '0.5rem',
                boxShadow: product.quantity > 0
                  ? '6px 6px 8px #036d4c, -6px -6px 8px #0e9e69'
                  : 'inset 3px 3px 6px #7f7f7f, inset -3px -3px 6px #b0b0b0',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => {
                if (product.quantity > 0) {
                  e.currentTarget.style.background = 'linear-gradient(145deg, #047857, #065f46)';
                  e.currentTarget.style.boxShadow = 'inset 2px 2px 6px #055d42, inset -2px -2px 6px #0a6d4b';
                }
              }}
              onMouseLeave={(e) => {
                if (product.quantity > 0) {
                  e.currentTarget.style.background = 'linear-gradient(145deg, #059669, #047857)';
                  e.currentTarget.style.boxShadow = '6px 6px 8px #036d4c, -6px -6px 8px #0e9e69';
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
