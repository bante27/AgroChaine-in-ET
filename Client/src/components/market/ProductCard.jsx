import React from 'react';
import { MapPin, Star, Eye, ShoppingCart } from 'lucide-react';
import Button from '../common/Button';

const ProductCard = ({ product, viewMode, onClick, onAddToCart, onBuyNow }) => {
  return (
    <div
      className={`h-full flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transform transition duration-300 hover:-translate-y-1
        ${viewMode === 'list' ? 'md:flex-row' : ''}
      `}
      style={{ minHeight: '220px' }} // a bit bigger
    >
      {/* Image */}
      <div className={`${viewMode === 'list' ? 'md:w-48' : ''} relative`}>
        <img
          src={
            product.images?.length > 0
              ? `http://localhost:5000${product.images[0]}`
              : 'https://via.placeholder.com/300/000000/ffffff?text=No+Image'
          }
          alt={product.title}
          className={`w-full object-cover ${viewMode === 'list' ? 'h-32 md:h-44' : 'h-48'} transition-transform duration-300 hover:scale-105`}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300/000000/ffffff?text=No+Image';
          }}
        />
        {product.verified && (
          <span className="absolute top-2 left-2 text-[9px] font-semibold bg-green-500 text-white px-2 py-0.5 rounded shadow">
            Verified
          </span>
        )}
        {product.quantity <= 0 && (
          <span className="absolute top-2 right-2 text-[9px] font-semibold bg-red-500 text-white px-2 py-0.5 rounded shadow">
            Sold Out
          </span>
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 p-4 flex flex-col justify-between ${viewMode === 'list' ? 'md:ml-4 md:p-3' : ''}`}>
        {/* Title & Rating */}
        <div>
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-[13px] font-semibold line-clamp-2 text-gray-800">{product.title}</h3>
            <div className="flex items-center space-x-1 text-yellow-500 text-[11px]">
              <Star className="h-3 w-3 fill-yellow-400" />
              <span>{product.rating || '0'} ({product.reviews?.length || 0})</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-1">
            <MapPin className="h-3 w-3" />
            <span>{product.originAddress || 'Unknown'}</span>
          </div>

          {/* Seller */}
          <p className="text-[10px] text-pink-600">
            by <span className="font-medium text-sky-900">{product.ownerName || 'Seller'}</span>
          </p>
        </div>

        {/* Price & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
          <div>
            <span className="text-[14px] font-bold text-gray-900">
              {product.price ? `${product.price} ETB` : 'N/A'}
            </span>
            <span className="text-gray-500 ml-1 text-[9px]">/kg</span>
          </div>

          <div className="flex gap-1 flex-wrap">
            {/* View Button */}
            <Button
              variant="outline"
              size="tiny"
              onClick={onClick}
              className="flex items-center gap-1 px-2 py-0.5 text-[10px] rounded border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <Eye className="h-3 w-3" /> View
            </Button>

            {/* Add to Cart */}
            <Button
              size="tiny"
              onClick={() => onAddToCart(product)}
              disabled={product.quantity <= 0}
              className={`flex items-center gap-1 px-2 py-0.5 text-[10px] text-white rounded shadow ${
                product.quantity > 0
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500'
                  : 'bg-gray-200 text-lime-950 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="h-3 w-3" /> Add to Cart
            </Button>

            {/* Buy Now */}
            <Button
              size="tiny"
              onClick={() => onBuyNow(product)}
              disabled={product.quantity <= 0}
              className={`flex items-center gap-1 px-2 py-0.5 text-[10px] text-white rounded shadow ${
                product.quantity > 0
                  ? 'bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500'
                  : 'bg-gray-200 text-lime-950 cursor-not-allowed'
              }`}
            >
              Buy now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
