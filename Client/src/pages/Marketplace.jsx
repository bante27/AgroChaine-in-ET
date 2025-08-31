import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '../components/market/HeroSection';
import FiltersSection from '../components/market/FiltersSection';
import ProductsDisplay from '../components/market/ProductsDisplay';
import ProductModal from '../components/market/ProductModal';
import CartSidebar from '../components/market/CartSidebar';
import AuthModal from '../components/market/AuthModal';
import LiveChat from '../components/LiveChat';
import CheckoutModal from '../components/market/CheckoutModal';
import axios from 'axios';
import toast from 'react-hot-toast';

const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3 },
};

const Marketplace = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('price-low');
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState(JSON.parse(localStorage.getItem('cart')) || []);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const searchInputRef = useRef(null);
  const shippingFee = 50;

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'vegetable', label: 'Vegetable' },
    { value: 'fruit', label: 'Fruit' },
    { value: 'grain', label: 'Grain' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        q: searchTerm || undefined,
        type: selectedCategory || undefined,
        page,
        limit: 20,
      };
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
        params,
      });

      let products = response.data.items || response.data.products || [];
      if (!Array.isArray(products)) products = [];

      let sorted = [...products];
      switch (sortBy) {
        case 'price-low':
          sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price-high':
          sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'newest':
          sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          break;
        case 'rating':
          sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
          break;
        default:
          sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      }

      setDisplayedProducts(sorted);
      setTotalPages(Math.ceil((response.data.total || products.length) / 20));
    } catch (err) {
      console.error(err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, page, token, sortBy]);

  const handleSearchChange = (e) => setInputValue(e.target.value);
  const handleSearchSubmit = () => {
    setSearchTerm(inputValue.trim());
    setPage(1);
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearchSubmit();
  };
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };
  const handleSortChange = (e) => setSortBy(e.target.value);
  const openModal = (product) => {
    setSelectedProduct(product);
    setComments([]);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleAddToCart = (product) => {
    const exist = cartItems.find((i) => i._id === product._id);
    const updated = exist
      ? cartItems.map((i) => (i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i))
      : [...cartItems, { ...product, quantity: 1 }];
    setCartItems(updated);
    setIsCartOpen(true);
    toast.success(`${product.title} added to cart`, {
      style: {
        background: '#10b981',
        color: '#fff',
        borderRadius: '8px',
      },
    });
  };

  const handleBuyNow = (product) => {
    setCartItems([{ ...product, quantity: 1 }]);
    setIsCheckoutOpen(true);
  };

  const updateCartQuantity = (id, qty) => {
    if (qty <= 0) setCartItems(cartItems.filter((i) => i._id !== id));
    else setCartItems(cartItems.map((i) => (i._id === id ? { ...i, quantity: qty } : i)));
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 text-red-500 font-semibold text-lg">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800 font-inter">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <HeroSection />
          <FiltersSection
            inputValue={inputValue}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            onKeyPress={handleKeyPress}
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchInputRef={searchInputRef}
          />
          <div className="mt-8">
            <ProductsDisplay
              products={displayedProducts}
              viewMode={viewMode}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onProductClick={openModal}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <>
            <motion.div
              key="product-backdrop"
              className="fixed inset-0 bg-black/60 z-40"
              variants={modalBackdrop}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={closeModal}
            />
            <motion.div
              key="product-modal"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
              variants={{
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.95 },
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 sm:p-8">
                <ProductModal
                  isOpen={isModalOpen}
                  product={selectedProduct}
                  comments={comments}
                  newComment={newComment}
                  onCommentChange={(e) => setNewComment(e.target.value)}
                  onAddComment={() => {
                    if (newComment.trim()) {
                      setComments([...comments, { user: 'You', text: newComment }]);
                      setNewComment('');
                    }
                  }}
                  onClose={closeModal}
                  onAddToCart={handleAddToCart}
                  onBuyNow={handleBuyNow}
                />
              </div>
            </motion.div>
          </>
        )}

        {isCartOpen && (
          <>
            <motion.div
              key="cart-backdrop"
              className="fixed inset-0 bg-black/60 z-40"
              variants={modalBackdrop}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div
              key="cart-sidebar"
              className="fixed top-0 right-0 h-full z-50 bg-white shadow-2xl w-full max-w-md p-6 flex flex-col"
              variants={{
                initial: { x: '100%' },
                animate: { x: 0 },
                exit: { x: '100%' },
                transition: { duration: 0.4, ease: 'easeOut' },
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <CartSidebar
                isCartOpen={isCartOpen}
                setIsCartOpen={setIsCartOpen}
                cartItems={cartItems}
                removeFromCart={(id) => setCartItems(cartItems.filter((i) => i._id !== id))}
                updateQuantity={updateCartQuantity}
                shippingFee={shippingFee}
                onCheckout={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
              />
            </motion.div>
          </>
        )}

        {isCheckoutOpen && (
          <>
            <motion.div
              key="checkout-backdrop"
              className="fixed inset-0 bg-black/60 z-40"
              variants={modalBackdrop}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setIsCheckoutOpen(false)}
            />
            <motion.div
              key="checkout-modal"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
              variants={{
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.95 },
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 sm:p-8">
                <CheckoutModal
                  isOpen={isCheckoutOpen}
                  onClose={() => setIsCheckoutOpen(false)}
                  cartItems={cartItems}
                  shippingFee={shippingFee}
                  token={token}
                  onPlaceOrder={() => {
                    setCartItems([]);
                    setIsCheckoutOpen(false);
                  }}
                  onLogin={() => {
                    setIsCheckoutOpen(false);
                    setIsAuthModalOpen(true);
                  }}
                />
              </div>
            </motion.div>
          </>
        )}

        {isAuthModalOpen && (
          <>
            <motion.div
              key="auth-backdrop"
              className="fixed inset-0 bg-black/60 z-40"
              variants={modalBackdrop}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={() => setIsAuthModalOpen(false)}
            />
            <motion.div
              key="auth-modal"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
              variants={{
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                exit: { opacity: 0, scale: 0.95 },
                transition: { duration: 0.3, ease: 'easeOut' },
              }}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
                <AuthModal
                  isOpen={isAuthModalOpen}
                  onClose={() => setIsAuthModalOpen(false)}
                  cartItems={cartItems}
                  shippingFee={shippingFee}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LiveChat />
    </div>
  );
};

export default Marketplace;