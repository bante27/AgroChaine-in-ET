import React from 'react';
import {
  MapPin,
  Star,
  Eye,
  ShoppingCart,
  BadgeCheck,
  AlertCircle,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import Button from '../common/Button';

const fallbackImage =
  'https://images.vexels.com/media/users/3/294725/isolated/preview/9c6a6d09dd7757ddf23bf4b3fd76cbbc-self-esteem-cloud-cute-icon.png';

const ProductCard = ({ product, viewMode, onClick, onAddToCart, onBuyNow }) => {
  const { t, language, transliterateName } = useLanguage();
  const imageUrl = product.images?.[0] || fallbackImage;
  const isSoldOut = product.quantityAvailable <= 0;

  return (
    <div
      className={`h-full flex flex-col backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform transition duration-300 hover:-translate-y-1 ${viewMode === 'list' ? 'md:flex-row' : ''
        }`}
      style={{
        minHeight: '240px',
        backgroundImage: 'linear-gradient(to right, #d3d3d3aa, #e0e0e0aa)',
      }}
    >
      {/* Image Section */}
      <div className={`${viewMode === 'list' ? 'md:w-52' : ''} relative`}>
        <img
          src={imageUrl}
          alt={product.title}
          className={`w-full object-cover ${viewMode === 'list' ? 'h-36 md:h-48' : 'h-56'
            } transition-transform duration-300 hover:scale-105`}
          onError={(e) => (e.target.src = fallbackImage)}
        />
        {product.verified && (
          <span className="absolute top-2 left-2 text-[10px] font-semibold bg-green-500 text-white px-2 py-0.5 rounded shadow flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" /> {t('marketplace.product.verified')}
          </span>
        )}
        {isSoldOut && (
          <span className="absolute top-2 right-2 text-[10px] font-semibold bg-red-500 text-white px-2 py-0.5 rounded shadow flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {t('marketplace.product.soldOut')}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div
        className={`flex-1 p-4 flex flex-col justify-between ${viewMode === 'list' ? 'md:ml-4 md:p-4' : ''
          }`}
      >
        {/* Product Info */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-[15px] md:text-[14px] sm:text-[13px] font-semibold text-gray-900 line-clamp-2 capitalize drop-shadow-sm">
              {language === 'am' ? transliterateName(product.title) : product.title}
            </h3>
            <div className="flex items-center text-yellow-500 text-[12px] sm:text-[10px]">
              <Star className="h-4 w-4 fill-yellow-400 mr-1" />
              {product.averageRating || 0} ({product.reviews?.length || 0})
            </div>
          </div>

          <div className="flex items-center text-gray-600 text-[11px] sm:text-[9px] mb-1">
            <MapPin className="h-3 w-3 mr-1" />
            {product.originAddress || t('marketplace.product.unknown')}
          </div>

          <p className="text-[11px] sm:text-[9px] text-blue-700">
            {t('marketplace.product.from')} <span className="font-medium text-gray-900">{transliterateName(product.ownerName) || t('marketplace.product.seller')}</span>
          </p>
        </div>

        {/* Price and Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2">
          <div>
            <span className="text-[16px] sm:text-[14px] font-bold text-gray-900">
              {product.price} {t('common.etb')}
            </span>
            <span className="text-gray-500 ml-1 text-[10px] sm:text-[9px]">{t('marketplace.product.perKg')}</span>
          </div>

          <div className="flex gap-2 flex-wrap text-[11px] sm:text-[9px]">
            {/* View Button */}
            <Button
              variant="outline"
              size="tiny"
              onClick={onClick}
              className="flex items-center gap-1 px-2 py-1 rounded border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <Eye className="h-4 w-4" /> {t('marketplace.product.view')}
            </Button>

            {/* Add to Cart Button */}
            <Button
              size="tiny"
              onClick={() => onAddToCart(product)}
              disabled={isSoldOut}
              className={`flex items-center gap-1 px-2 py-1 text-white rounded shadow ${isSoldOut
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500'
                }`}
            >
              <ShoppingCart className="h-4 w-4" /> {t('marketplace.product.cart')}
            </Button>

            {/* Buy Now Button */}
            <Button
              size="tiny"
              onClick={() => onBuyNow(product)}
              disabled={isSoldOut}
              className={`flex items-center gap-1 px-2 py-1 text-white rounded shadow ${isSoldOut
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500'
                }`}
            >
              {t('marketplace.product.buyNow')}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile-specific styles */}
      <style>
        {`
          @media (max-width: 640px) {
            img {
              height: 120px !important;
            }
            h3 {
              font-size: 0.75rem !important;
            }
            p, span {
              font-size: 0.65rem !important;
            }
            .flex > div > span {
              font-size: 0.65rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default ProductCard;
