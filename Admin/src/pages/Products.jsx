import React, { useState, useEffect } from 'react';
import {
  Package,
  Eye,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
} from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/apiConfig';
import { useTheme } from '../context/ThemeContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);

  const { isDark } = useTheme();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/products`, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      });
      // Backend returns { success: true, products: [...] }
      const productList = response.data.products || [];
      setProducts(productList);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await axios.delete(`${API_URL}/api/admin/products/${productId}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
        });
        if (response.data.success) {
          fetchProducts(); // Refresh list
          setSelectedProduct(null);
          setError(null);
        } else {
          setError(response.data.error || 'Failed to delete product.');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setError(error.response?.data?.error || 'Failed to delete product. Please try again.');
      }
    }
  };

  // Helper: get display name for owner (backend may not return ownerName)
  const getOwnerName = (product) => {
    return product.ownerName || product.ownerUserId || product.sellerName || 'Unknown Seller';
  };

  // Helper: get product identifier (prefer productId, fallback to _id)
  const getProductId = (product) => {
    return product.productId || product._id;
  };

  const filteredProducts = products.filter((product) => {
    const title = product.title || '';
    const owner = getOwnerName(product);
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           owner.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusBadge = (status) => {
    const baseClasses =
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border';
    switch (status) {
      case 'active':
        return (
          <span
            className={`${baseClasses} bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20`}
          >
            <CheckCircle className="w-3 h-3 mr-1" /> Active
          </span>
        );
      case 'sold out':
        return (
          <span
            className={`${baseClasses} bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20`}
          >
            <Clock className="w-3 h-3 mr-1" /> Sold Out
          </span>
        );
      default:
        return (
          <span
            className={`${baseClasses} bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20`}
          >
            <XCircle className="w-3 h-3 mr-1" /> Removed
          </span>
        );
    }
  };

  // Helper to extract reviews/comments (backend may use 'reviews' or 'comments')
  const getProductReviews = (product) => {
    return product?.reviews || product?.comments || [];
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'
          }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 lg:p-8 transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
        }`}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-cyan-500" />
            <h1 className="text-2xl font-bold">Product Management</h1>
          </div>
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'
                }`}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 w-64 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200 ${isDark
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                }`}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg border border-red-500/20 shadow-md">
            {error}
          </div>
        )}

        {/* Product List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => {
              const productId = getProductId(product);
              const ownerName = getOwnerName(product);
              const imageUrl = product.images?.[0] || 'https://via.placeholder.com/400x160?text=No+Image';
              return (
                <div
                  key={productId}
                  className={`rounded-xl border shadow flex flex-col transform transition-all duration-300 ease-in-out overflow-hidden ${isDark
                    ? 'bg-gray-800 border-gray-700 hover:shadow-cyan-500/20 hover:border-cyan-400/40'
                    : 'bg-white border-gray-200 hover:shadow-lg hover:border-cyan-400/40'
                    } hover:scale-[1.02]`}
                >
                  {/* Image Background */}
                  <div
                    className="h-40 bg-cover bg-center transition-transform duration-500 ease-in-out hover:scale-105"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  />
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold">{product.title || 'Untitled'}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {product.price?.toFixed(2)} ETB
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      by {ownerName}
                    </p>
                    <div className="mb-3">{getStatusBadge(product.status)}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {product.quantityAvailable || 0} KG in stock
                      <br />
                      Type: {product.type || 'N/A'}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="flex-1 p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(productId)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
              No products found.
            </div>
          )}
        </div>

        {/* Product Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4 py-6 overflow-y-auto">
            <div
              className={`max-w-2xl w-full p-6 rounded-xl shadow-lg border my-auto ${isDark
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-200 text-gray-900'
                }`}
            >
              <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Package className="w-5 h-5 text-cyan-500" />
                  Product Details
                </h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className={`p-1.5 rounded-lg transition-colors ${isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {/* Detail Rows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
                <div><strong>Title:</strong> {selectedProduct.title || '-'}</div>
                <div><strong>Owner:</strong> {getOwnerName(selectedProduct)}</div>
                <div><strong>Price:</strong> {selectedProduct.price?.toFixed(2)} ETB</div>
                <div><strong>Status:</strong> {getStatusBadge(selectedProduct.status)}</div>
                <div><strong>Type:</strong> {selectedProduct.type || '-'}</div>
                <div><strong>Stock Available:</strong> {selectedProduct.quantityAvailable || 0} KG</div>
                <div><strong>Sold Quantity:</strong> {selectedProduct.soldQuantity || 0} KG</div>
                <div><strong>Likes:</strong> {selectedProduct.likesCount || 0}</div>
                <div><strong>Average Rating:</strong> {selectedProduct.averageRating || 0} / 5</div>
                <div className="md:col-span-2"><strong>Origin Address:</strong> {selectedProduct.originAddress || '-'}</div>
                <div className="md:col-span-2"><strong>Description:</strong> {selectedProduct.description || '-'}</div>
              </div>

              {/* Reviews Section */}
              <div className="border-t pt-4 border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-semibold mb-3 flex items-center gap-2 text-cyan-500">
                  <MessageSquare className="w-4 h-4" />
                  User Reviews ({getProductReviews(selectedProduct).length})
                </h3>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {getProductReviews(selectedProduct).length > 0 ? (
                    getProductReviews(selectedProduct).map((c, i) => (
                      <div
                        key={c._id || i}
                        className={`p-3 rounded-lg border text-sm transition-colors ${isDark
                          ? 'bg-gray-700/50 border-gray-600 text-gray-200'
                          : 'bg-gray-50 border-gray-200 text-gray-700'
                          }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-cyan-600 dark:text-cyan-400">
                            {c.userName || c.user || 'Anonymous User'}
                          </span>
                          {c.createdAt && (
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        <p className="leading-relaxed">{c.comment || c.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic text-center py-2">No reviews posted for this product yet.</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isDark
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Close
                </button>
                <button
                  onClick={() => handleDeleteProduct(getProductId(selectedProduct))}
                  className="px-4 py-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;