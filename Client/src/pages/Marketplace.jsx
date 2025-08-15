import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Grid,
  List,
  Star,
  MapPin,
  Eye,
  ShoppingCart,
  Heart,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import LiveChat from '../components/LiveChat';

const Marketplace = ({ products: initialProducts = [], onAddToCart }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [displayedProducts, setDisplayedProducts] = useState(initialProducts);

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'vegetable', label: 'Vegetables' },
    { value: 'fruit', label: 'Fruits' },
    { value: 'grain', label: 'Grains' },
    { value: 'other', label: 'Other' },
  ];
useEffect(() => {
  console.log('Initial Products:', initialProducts);
  let filteredProducts = [...(initialProducts || [])];

  if (selectedCategory !== 'all') {
    filteredProducts = filteredProducts.filter(
      (product) => product.type === selectedCategory
    );
  }

  if (searchTerm) {
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.originAddress &&
          product.originAddress.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }

  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price) - parseFloat(b.price);
      case 'price-high':
        return parseFloat(b.price) - parseFloat(a.price);
      case 'newest':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  console.log('Filtered Products:', filteredProducts);
  setDisplayedProducts(filteredProducts);
}, [selectedCategory, searchTerm, sortBy, initialProducts]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white/90 via-blue-800 to-slate-900">
      {/* Hero Section */}
      <section className="hero-gradient section-padding text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl font-bold mb-6">vital Marketplace</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white/5 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value} className="bg-gray-800">
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white/5 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest" className="bg-gray-800">Newest First</option>
                <option value="price-low" className="bg-gray-800">Price: Low to High</option>
                <option value="price-high" className="bg-gray-800">Price: High to Low</option>
                <option value="rating" className="bg-gray-800">Highest Rated</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
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
            <h2 className="text-2xl font-bold text-white">
              {displayedProducts.length} Products Found
            </h2>
          </div>

          {displayedProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
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
                  key={product._id}
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
                        <span className="text-sm text-gray-600">{product.originAddress}</span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        by {product.seller || 'Unknown Seller'}
                      </p>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-emerald-600">
                            {product.price} ETB
                          </span>
                          <span className="text-gray-500 ml-1">
                            per kg
                          </span>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="outline" size="small">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="small"
                            onClick={() => onAddToCart(product)}
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
      {/* Live Chat Component */}
      <LiveChat />
    </div>
  );
};

export default Marketplace;