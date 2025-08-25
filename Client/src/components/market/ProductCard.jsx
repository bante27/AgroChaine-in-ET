import React from 'react';
import { MapPin, Star, Eye, ShoppingCart } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

const ProductCard = ({ product, viewMode, onClick, onAddToCart, onBuyNow }) => {
  return (
    <Card 
      hover 
      className={`h-full flex flex-col transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg ${viewMode === 'list' ? 'md:flex-row' : ''}`}
    >
      {/* Image */}
      <div className={`${viewMode === 'list' ? 'md:flex-shrink-0 md:w-48' : ''}`}>
        <div className="relative w-full">
          <img
            src={
              product.images && product.images.length > 0
                ? `http://localhost:5000${product.images[0]}`
                : 'https://via.placeholder.com/300'
            }
            alt={product.title}
            className={`w-full object-cover rounded-lg ${viewMode === 'list' ? 'h-32 md:h-48' : 'h-48'}`}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
          />
          {product.verified && (
            <div className="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              Verified
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={`flex-1 mt-4 ${viewMode === 'list' ? 'md:ml-6 md:mt-0' : ''} flex flex-col justify-between`}>
        {/* Title & Rating */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {product.title}
            </h3>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">
                {product.rating || '0'} ({product.reviews || '0'})
              </span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 mb-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{product.originAddress || 'Unknown Location'}</span>
          </div>

          {/* Seller */}
          <p className="text-sm text-gray-700 mb-3">
            by <span className="font-medium">{product.owner?.fullName || product.owner?.username || 'Unknown Seller'}</span>
          </p>
        </div>

        {/* Price & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-auto">
          <div>
            <span className="text-2xl font-bold text-emerald-600">
              {product.price ? `${product.price} ETB` : 'N/A'}
            </span>
            <span className="text-gray-500 ml-1 text-sm">per kg</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <Button 
              variant="outline" 
              size="xs" 
              onClick={onClick} 
              className="flex items-center gap-1 px-2 py-1 text-sm sm:text-xs"
            >
              <Eye className="h-3 w-3" /> View
            </Button>

            <Button
              size="xs"
              onClick={() => onAddToCart(product)}
              disabled={product.quantity <= 0}
              className="flex items-center gap-1 px-2 py-1 text-sm sm:text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-3 w-3" /> {product.quantity > 0 ? 'Add' : 'Out'}
            </Button>

            <Button
              size="xs"
              onClick={() => onBuyNow(product)}
              disabled={product.quantity <= 0}
              className="flex items-center gap-1 px-2 py-1 text-sm sm:text-xs bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
