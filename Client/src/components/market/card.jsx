import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  MapPin,
  Star,
  Eye,
  ShoppingCart,
  BadgeCheck,
  AlertCircle,
} from 'lucide-react';
import Button from '../common/Button';
import CheckoutModal from './CheckoutModal'; // import the modal

const fallbackImage =
  'https://images.vexels.com/media/users/3/294725/isolated/preview/9c6a6d09dd7757ddf23bf4b3fd76cbbc-self-esteem-cloud-cute-icon.png';

const ProductCard = ({ product, viewMode, onClick, onAddToCart }) => {
  const [currentProduct, setCurrentProduct] = useState(product);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const imageUrl = currentProduct.images?.[0] || fallbackImage;
  const isSoldOut =
    (currentProduct.quantity ?? currentProduct.quantityAvailable ?? 0) <= 0;

  // ---------------- Buy Now Function ----------------
  const handleBuyNow = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue');
      return;
    }
    // Open checkout modal with current product as the cart
    setCheckoutOpen(true);
  };

  // After successful checkout, update product quantity
  const handleOrderSuccess = (updatedProduct) => {
    if (updatedProduct) setCurrentProduct(updatedProduct);
    setCheckoutOpen(false);
    toast.success('Order placed successfully!');
  };

  return (
    <>
      <div
        className={`relative h-full flex flex-col backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transform transition duration-300 hover:-translate-y-1 ${
          viewMode === 'list' ? 'md:flex-row' : ''
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
            alt={currentProduct.title}
            className={`w-full object-cover ${
              viewMode === 'list' ? 'h-36 md:h-48' : 'h-56'
            } transition-transform duration-300 hover:scale-105`}
            onError={(e) => (e.target.src = fallbackImage)}
          />

          {currentProduct.verified && (
            <span className="absolute top-2 left-2 text-[10px] font-semibold bg-green-500 text-white px-2 py-0.5 rounded shadow flex items-center gap-1">
              <BadgeCheck className="w-3 h-3" /> Verified
            </span>
          )}

          {isSoldOut && (
            <span className="absolute top-2 right-2 text-[10px] font-semibold bg-red-500 text-white px-2 py-0.5 rounded shadow flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Sold Out
            </span>
          )}

          {isSoldOut && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center text-red-600 font-bold text-sm md:text-base">
              <AlertCircle className="w-5 h-5 mr-1" /> SOLD OUT
            </div>
          )}
        </div>

        {/* Content Section */}
        <div
          className={`flex-1 p-4 flex flex-col justify-between ${
            viewMode === 'list' ? 'md:ml-4 md:p-4' : ''
          }`}
        >
          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-[15px] md:text-[14px] sm:text-[13px] font-semibold text-gray-900 line-clamp-2 capitalize drop-shadow-sm">
                {currentProduct.title}
              </h3>
              <div className="flex items-center text-yellow-500 text-[12px] sm:text-[10px]">
                <Star className="h-4 w-4 fill-yellow-400 mr-1" />
                {currentProduct.averageRating || 0} (
                {currentProduct.reviews?.length || 0})
              </div>
            </div>

            <div className="flex items-center text-gray-600 text-[11px] sm:text-[9px] mb-1">
              <MapPin className="h-3 w-3 mr-1" />
              {currentProduct.originAddress || 'Unknown'}
            </div>

            <p className="text-[11px] sm:text-[9px] text-blue-700">
              by{' '}
              <span className="font-medium text-gray-900">
                {currentProduct.ownerName || 'Seller'}
              </span>
            </p>
          </div>

          {/* Price and Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-2">
            <div className="flex flex-col">
              <div>
                <span className="text-[16px] sm:text-[14px] font-bold text-gray-900">
                  {currentProduct.price} ETB
                </span>
                <span className="text-gray-500 ml-1 text-[10px] sm:text-[9px]">
                  /kg
                </span>
              </div>

              <div className="text-[10px] text-gray-600 mt-1">
                <span className="mr-2">
                  Available: {currentProduct.quantityAvailable ?? 0}
                </span>
                <span className="text-orange-600">
                  Sold:{' '}
                  {currentProduct.initialQuantity -
                    (currentProduct.quantityAvailable ?? 0)}
                </span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap text-[11px] sm:text-[9px]">
              <Button
                variant="outline"
                size="tiny"
                onClick={onClick}
                className="flex items-center gap-1 px-2 py-1 rounded border-gray-300 text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              >
                <Eye className="h-4 w-4" /> View
              </Button>

              <Button
                size="tiny"
                onClick={() => onAddToCart(currentProduct)}
                disabled={isSoldOut}
                className={`flex items-center gap-1 px-2 py-1 text-white rounded shadow ${
                  isSoldOut
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500'
                }`}
              >
                <ShoppingCart className="h-4 w-4" /> Cart
              </Button>

              <Button
                size="tiny"
                onClick={handleBuyNow}
                disabled={isSoldOut}
                className={`flex items-center gap-1 px-2 py-1 text-white rounded shadow ${
                  isSoldOut
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500'
                }`}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutOpen && (
        <CheckoutModal
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          cartItems={[currentProduct]} // only this product for Buy Now
          token={sessionStorage.getItem('token')}
          onOrderSuccess={(data) => handleOrderSuccess(data.updatedProduct)}
        />
      )}
    </>
  );
};

export default ProductCard;
