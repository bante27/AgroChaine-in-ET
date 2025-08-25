import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
        case 'price-low': sorted.sort((a, b) => (a.price || 0) - (b.price || 0)); break;
        case 'price-high': sorted.sort((a, b) => (b.price || 0) - (a.price || 0)); break;
        case 'newest': sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)); break;
        case 'rating': sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
        default: sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
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

  useEffect(() => { fetchProducts(); }, [searchTerm, selectedCategory, page, token, sortBy]);

  const handleSearchChange = (e) => setInputValue(e.target.value);
  const handleSearchSubmit = () => { setSearchTerm(inputValue.trim()); setPage(1); };
  const handleKeyPress = (e) => { if (e.key === 'Enter') handleSearchSubmit(); };
  const handleCategoryChange = (e) => { setSelectedCategory(e.target.value); setPage(1); };
  const handleSortChange = (e) => setSortBy(e.target.value);
  const openModal = (product) => { setSelectedProduct(product); setComments([]); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  const handleAddToCart = (product) => {
    const exist = cartItems.find(i => i._id === product._id);
    const updated = exist
      ? cartItems.map(i => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...cartItems, { ...product, quantity: 1 }];
    setCartItems(updated);
    setIsCartOpen(true);
    toast.success(`${product.title} added to cart`);
  };

  const handleBuyNow = (product) => {
    setCartItems([{ ...product, quantity: 1 }]);
    setIsCheckoutOpen(true);
  };

  const updateCartQuantity = (id, qty) => {
    if (qty <= 0) setCartItems(cartItems.filter(i => i._id !== id));
    else setCartItems(cartItems.map(i => i._id === id ? { ...i, quantity: qty } : i));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );

  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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

      <div className="flex-1 px-2 sm:px-6 lg:px-12 my-4">
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

      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
        comments={comments}
        newComment={newComment}
        onCommentChange={(e) => setNewComment(e.target.value)}
        onAddComment={() => {
          if (newComment.trim()) { setComments([...comments, { user: 'You', text: newComment }]); setNewComment(''); }
        }}
        onClose={closeModal}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      <CartSidebar
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartItems={cartItems}
        removeFromCart={(id) => setCartItems(cartItems.filter((i) => i._id !== id))}
        updateQuantity={updateCartQuantity}
        shippingFee={shippingFee}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        shippingFee={shippingFee}
        token={token}
        onPlaceOrder={() => { setCartItems([]); setIsCheckoutOpen(false); }}
        onLogin={() => setIsAuthModalOpen(true)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        cartItems={cartItems}
        shippingFee={shippingFee}
      />

      <LiveChat />
    </div>
  );
};

export default Marketplace;
