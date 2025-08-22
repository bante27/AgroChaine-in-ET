import React from 'react';
import { Star, MapPin, Heart, Eye, ShoppingCart } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const ProductCard = ({ product, viewMode, onView, onAddToCart, onBuyNow }) => {
  return (
    <Card hover className={`h-full ${viewMode === 'list' ? 'flex' : ''}`}>
      <div className={`${viewMode === 'list' ? 'flex-shrink-0 w-48' : ''}`}>
        <div className="relative">
          <img
            src={
              product.images && product.images.length > 0
                ? `http://localhost:5000${product.images[0]}`
                : 'https://via.placeholder.com/300'
            }
            alt={product.title}
            className={`w-full object-cover rounded-lg ${
              viewMode === 'list' ? 'h-32' : 'h-48'
            }`}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
          />
          {product.verified && (
            <div className="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium">
              Verified
            </div>
          )}
          <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className={`${viewMode === 'list' ? 'flex-1 ml-6' : 'mt-4'}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {product.title}
          </h3>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {product.rating || '0'} ({product.reviews || '0'})
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{product.originAddress || 'Unknown Location'}</span>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          by {product.owner?.fullName || product.owner?.username || 'Unknown Seller'}
        </p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-emerald-600">
              {product.price ? `${product.price} ETB` : 'N/A'}
            </span>
            <span className="text-gray-500 ml-1">
              per kg
            </span>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="small" onClick={onView}>
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button
              size="small"
              onClick={onAddToCart}
              disabled={product.quantity <= 0}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button
              size="small"
              onClick={onBuyNow}
              disabled={product.quantity <= 0}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;