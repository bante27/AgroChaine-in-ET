import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  MapPin,
  Eye,
  ShoppingCart,
  Heart
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input'; // Assuming you have this component, though not used directly in the provided snippet

const Marketplace = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // New states for dynamic product data
  const [products, setProducts] = useState([]); // This will hold the fetched products
  const [loading, setLoading] = useState(true); // To indicate data fetching status
  const [error, setError] = useState(null); // To handle fetch errors

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'grains', label: 'Grains' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'livestock', label: 'Livestock' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'spices', label: 'Spices' }
  ];

  // Function to fetch products from your backend API
  const fetchProducts = async () => {
    setLoading(true); // Start loading
    setError(null); // Clear previous errors

    try {
      // Construct query parameters for your API
      const queryParams = new URLSearchParams({
        category: selectedCategory,
        search: searchTerm,
        sortBy: sortBy,
      }).toString();

      // Replace '/api/products' with your actual backend endpoint
      // This endpoint should return only verified and approved products
      const response = await fetch(`/api/products?${queryParams}`);

      if (!response.ok) {
        // If the server response is not OK (e.g., 404, 500)
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setProducts(data); // Update products state with fetched data
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try refreshing the page or try again later.");
    } finally {
      setLoading(false); // End loading, regardless of success or failure
    }
  };

  // useEffect hook to trigger data fetching when filters or sort order change
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm, sortBy]); // Dependencies: re-run fetch when these change

  // This `filteredProducts` will now be primarily for client-side search if the backend
  // already handles category and sorting. If backend only returns ALL approved products,
  // then this client-side filter would apply category and sort as well.
  // For simplicity, let's assume the backend handles category and sort,
  // and `searchTerm` is applied client-side on the results.
  // If your backend can filter by category and sort, `products` will already be pre-filtered/sorted.
  const displayedProducts = products.filter(product => {
    // Only filter by search term on the client side if the backend doesn't handle it
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="hero-gradient section-padding text-white">
        <div className="container-max">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">
              Digital Marketplace
            </h1>
            <p className="text-xl text-emerald-100 leading-relaxed">
              Discover fresh, quality agricultural products directly from verified Ethiopian farmers
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b">
        <div className="container-max">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products or farmers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
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
        <div className="container-max">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${displayedProducts.length} Products Found`}
            </h2>
          </div>

          {/* Conditional Rendering based on loading, error, and product count */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Fetching fresh produce for you...</p>
              {/* You could add a spinner here */}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 font-medium mb-2">Error loading products!</p>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
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
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card hover className={`h-full ${viewMode === 'list' ? 'flex' : ''}`}>
                    <div className={`${viewMode === 'list' ? 'flex-shrink-0 w-48' : ''}`}>
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`w-full object-cover rounded-lg ${
                            viewMode === 'list' ? 'h-32' : 'h-48'
                          }`}
                        />
                        {product.verified && ( // Assuming 'verified' comes from backend
                          <div className="absolute top-2 left-2 bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Verified
                          </div>
                        )}
                        {!product.inStock && ( // Assuming 'inStock' comes from backend
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                            <span className="text-white font-medium">Out of Stock</span>
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
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {product.rating} ({product.reviews})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{product.location}</span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        by {product.farmer}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-emerald-600">
                            ${product.price}
                          </span>
                          <span className="text-gray-500 ml-1">
                            per {product.unit}
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="small">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="small"
                            disabled={!product.inStock}
                            className="disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
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
    </div>
  );
};

export default Marketplace;