import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // For login redirection and Buy Now navigation
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LiveChat from '../components/LiveChat';
import axios from 'axios';
import toast from 'react-hot-toast';

const Marketplace = ({ token, onAddToCart, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, refreshTrigger }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('price-low');
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate(); // Hook for navigation

  // Debug: Log token to verify its value
  console.log('Token received in Marketplace:', token);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'vegetable', label: 'Vegetable' },
    { value: 'fruit', label: 'Fruit' },
    { value: 'grain', label: 'Grain' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'other', label: 'Other' },
  ];

  // Reset page to 1 when search, category, sort, or refresh changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, sortBy, refreshTrigger]);

  // Fetch products when search, category, sort, page, or refresh changes
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy, page, refreshTrigger]);

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
      console.log('Fetching products with params:', params); // Debug log
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      console.log('API response:', response.data); // Debug log to check if owner is populated
      let products = response.data.items || response.data.products || [];
      if (!Array.isArray(products)) {
        products = []; // Fallback if API returns unexpected data
        console.warn('API returned non-array data for products:', response.data);
      }
      setDisplayedProducts(products);
      setTotalPages(response.data.pages || Math.ceil((response.data.total || products.length) / 20));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load products');
      toast.error(err.response?.data?.error || 'Failed to load products');
      console.error('Fetch error:', err); // Debug log
    } finally {
      setLoading(false);
    }
  };

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Handle Add to Cart with login check
  const handleAddToCart = (product) => {
    if (!token || token === 'null' || token === 'undefined') { // Robust check for falsy token
      toast.error('Please login to add to cart');
      navigate('/login');
      return;
    }
    onAddToCart(product); // Proceed if logged in
    toast.success(`${product.title} added to cart`);
  };

  // Handle Buy Now with login check
  const handleBuyNow = (product) => {
    if (!token || token === 'null' || token === 'undefined') { // Robust check for falsy token
      toast.error('Please login or create an account to buy now');
      navigate('/login');
      return;
    }
    onAddToCart(product); // Add to cart first
    navigate('/checkout', { state: { product, quantity: 1 } }); // Navigate to checkout
    toast.success(`Proceeding to checkout for ${product.title}`);
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
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white/5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white/5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value} className="bg-white">
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white/5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="price-low" className="bg-white">Price: Low to High</option>
                <option value="price-high" className="bg-white">Price: High to Low</option>
                <option value="newest" className="bg-white">Newest First</option>
                <option value="rating" className="bg-white">Highest Rated</option>
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
                        by {product.owner?.fullName || product.owner?.username || 'Anonymous Seller'}
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
                  <p><strong>Seller:</strong> {selectedProduct.owner?.fullName || product.owner?.username || 'Anonymous Seller'}</p>
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
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <LiveChat />
    </div>
  );
};

export default Marketplace;