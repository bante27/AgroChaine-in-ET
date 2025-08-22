import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid,
  List,
  Star,
  MapPin,
  Eye,
  ShoppingCart,
  Heart,
  X,
  CreditCard,
  Wallet,
  Banknote,
  Truck,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LiveChat from '../components/LiveChat';
import axios from 'axios';
import toast from 'react-hot-toast';
import debounce from 'lodash.debounce';

const Marketplace = ({ token, onAddToCart, refreshTrigger }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('price-low');
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  // Debug re-renders and token changes
  useEffect(() => {
    console.log('Marketplace component re-rendered, token:', token);
  }, [token]);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'vegetable', label: 'Vegetable' },
    { value: 'fruit', label: 'Fruit' },
    { value: 'grain', label: 'Grain' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'other', label: 'Other' },
  ];

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      console.log('Search term updated:', value);
      setSearchTerm(value);
    }, 500),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
    console.log('Input focus check:', document.activeElement === searchInputRef.current);
  };

  // Log focus loss
  const handleBlur = () => {
    console.log('Search input lost focus');
  };

  // Reset inputValue when searchTerm is cleared
  useEffect(() => {
    if (!searchTerm) {
      setInputValue('');
    }
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, sortBy, refreshTrigger]);

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, page, refreshTrigger, token]);

  useEffect(() => {
    applyClientSideSort();
  }, [sortBy, rawProducts]);

  const applyClientSideSort = () => {
    if (!rawProducts.length) return;
    let sortedProducts = [...rawProducts];
    switch (sortBy) {
      case 'price-low':
        sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        sortedProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'newest':
        sortedProducts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'rating':
        sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        sortedProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
    }
    setDisplayedProducts(sortedProducts);
    console.log('Client-side sorted products:', sortedProducts.map(p => ({ title: p.title, price: p.price, rating: p.rating, createdAt: p.createdAt, owner: p.owner })));
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let sortParam;
      switch (sortBy) {
        case 'price-low':
          sortParam = 'price';
          break;
        case 'price-high':
          sortParam = '-price';
          break;
        case 'newest':
          sortParam = '-createdAt';
          break;
        case 'rating':
          sortParam = '-rating';
          break;
        default:
          sortParam = 'price';
      }

      const params = {
        q: searchTerm || undefined,
        type: selectedCategory || undefined,
        page,
        limit: 20,
        sort: sortParam,
      };
      console.log('Fetching products with params:', params);
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: token ? `Bearer ${token}` : undefined },
        params,
      });
      console.log('Raw API response:', response.data);

      let products = response.data.items || response.data.products || [];
      if (!Array.isArray(products)) {
        console.warn('API returned non-array data for products:', response.data);
        products = [];
      }

      console.log('Products before owner mapping:', products);
      products = products.map(product => ({
        ...product,
        owner: product.owner && (product.owner.fullName || product.owner.username || product.owner.userId)
          ? { ...product.owner }
          : { fullName: 'Test Seller', username: 'testuser', userId: product.owner?.userId || '123' },
      }));
      console.log('Products after owner mapping:', products);

      if (searchTerm) {
        products = products.filter(product =>
          product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.originAddress?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setRawProducts(products);
      setDisplayedProducts(products);
      setTotalPages(response.data.pages || Math.ceil((response.data.total || products.length) / 20));
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to load products';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Fetch error:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.warn('Token may be invalid or expired:', token);
        setIsAuthModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setComments([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product) => {
    console.log('Add to Cart, token:', token);
    if (!token || token === '') {
      setIsAuthModalOpen(true);
      return;
    }
    onAddToCart(product);
    setCartItems([...cartItems, { ...product, quantity: 1 }]);
    setIsCartOpen(true);
    toast.success(`${product.title} added to cart`);
  };

  const handleBuyNow = (product) => {
    console.log('Buy Now, token:', token);
    if (!token || token === '') {
      setIsAuthModalOpen(true);
      return;
    }
    onAddToCart(product);
    navigate('/checkout', { state: { productId: product._id, quantity: 1 } });
    toast.success(`Proceeding to checkout for ${product.title}`);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, { text: newComment, user: 'Current User' }]);
    setNewComment('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="hero-gradient section-padding text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Vital Marketplace</h1>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
              Discover and sell fresh agricultural products
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products or locations..."
                  value={inputValue}
                  onChange={handleSearchChange}
                  onBlur={handleBlur}
                  ref={searchInputRef}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white/5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white/5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => {
                  console.log('Sort by updated:', e.target.value);
                  setSortBy(e.target.value);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white/5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="rating">Highest Rated</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Display */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {displayedProducts.length} Products Found
              {searchTerm && ` for "${searchTerm}"`}
              {sortBy && ` (Sorted by ${sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : sortBy === 'newest' ? 'Newest First' : 'Highest Rated'})`}
            </h2>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="small"
                disabled={page === 1}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 self-center">Page {page} of {totalPages}</span>
              <Button
                variant="outline"
                size="small"
                disabled={page === totalPages}
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              >
                Next
              </Button>
            </div>
          </div>

          {displayedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {displayedProducts.map((product, index) => (
                <motion.div
                  key={product._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
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
                          <Button variant="outline" size="small" onClick={() => openModal(product)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.quantity <= 0}
                            className="disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleBuyNow(product)}
                            disabled={product.quantity <= 0}
                            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold mb-4">{selectedProduct.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={
                      selectedProduct.images && selectedProduct.images.length > 0
                        ? `http://localhost:5000${selectedProduct.images[0]}`
                        : 'https://via.placeholder.com/300'
                    }
                    alt={selectedProduct.title}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <div className="flex overflow-x-auto gap-2">
                    {selectedProduct.images && selectedProduct.images.slice(1).map((img, i) => (
                      <img
                        key={i}
                        src={`http://localhost:5000${img}`}
                        alt={`${selectedProduct.title} image ${i + 2}`}
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <p><strong>Product ID:</strong> {selectedProduct.productId || 'N/A'}</p>
                  <p><strong>Price:</strong> {selectedProduct.price ? `${selectedProduct.price} ETB` : 'N/A'} per kg</p>
                  <p><strong>Quantity:</strong> {selectedProduct.quantity || 'N/A'} kg</p>
                  <p><strong>Type:</strong> {selectedProduct.type || 'N/A'}</p>
                  <p><strong>Origin Address:</strong> {selectedProduct.originAddress || 'Unknown'}</p>
                  <p><strong>Seller:</strong> {selectedProduct.owner?.fullName || selectedProduct.owner?.username || 'Unknown Seller'}</p>
                  <p><strong>Seller ID:</strong> {selectedProduct.owner?.userId || 'N/A'}</p>
                  <p><strong>Description:</strong> {selectedProduct.description || 'No description available'}</p>
                  <p><strong>Comment:</strong> {selectedProduct.comment || 'No comment'}</p>
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span>{selectedProduct.rating || '0'} ({selectedProduct.reviews || '0'} reviews)</span>
                  </div>
                  <Button
                    onClick={() => handleAddToCart(selectedProduct)}
                    disabled={selectedProduct.quantity <= 0}
                    className="w-full mt-4"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {selectedProduct.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <Button
                    onClick={() => handleBuyNow(selectedProduct)}
                    disabled={selectedProduct.quantity <= 0}
                    className="w-full mt-2 bg-green-600 hover:bg-green-700"
                  >
                    Buy Now
                  </Button>

                  {/* Comments Section */}
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Comments</h3>
                    <div className="space-y-4">
                      {comments.length === 0 ? (
                        <p className="text-gray-600">No comments yet.</p>
                      ) : (
                        comments.map((comment, i) => (
                          <div key={i} className="p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-600">{comment.user || 'Anonymous'}: {comment.text}</p>
                          </div>
                        ))
                      )}
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full rounded-lg border-gray-300 p-2 mt-4"
                      />
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                      >
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 overflow-y-auto p-6"
          >
            <button onClick={() => setIsCartOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            {cartItems.length === 0 ? (
              <p className="text-gray-600">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex space-x-4">
                    <img
                      src={item.images && item.images[0] ? `http://localhost:5000${item.images[0]}` : 'https://via.placeholder.com/300'}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p>{item.price} ETB x {item.quantity}</p>
                    </div>
                  </div>
                ))}
                <Button onClick={() => navigate('/checkout')} className="w-full bg-green-600 hover:bg-green-700">
                  Checkout
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login/Register Modal */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsAuthModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setIsAuthModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold mb-4">Log in or Register</h2>
              <p className="text-gray-600 mb-6">To add to cart or buy now, please log in or create an account.</p>
              <Button
                onClick={() => {
                  setIsAuthModalOpen(false);
                  navigate('/login', { state: { from: '/marketplace' } });
                }}
                className="w-full mb-4 bg-blue-600 hover:bg-blue-700"
              >
                Log In
              </Button>
              <Button
                onClick={() => {
                  setIsAuthModalOpen(false);
                  navigate('/Login', { state: { from: '/marketplace' } });
                }}
                variant="outline"
                className="w-full"
              >
                Create Account
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LiveChat />
    </div>
  );
};

export default Marketplace;