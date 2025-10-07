import React, { useState, useEffect } from 'react';
import {
  Package,
  Eye,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import axios from 'axios';
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
      const response = await axios.get('http://localhost:5000/api/admin/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
      });
      setProducts(response.data.products || []);
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
        const response = await axios.delete(`http://localhost:5000/api/admin/products/${productId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
        });
        if (response.data.success) {
          fetchProducts();
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

  const filteredProducts = products.filter((product) =>
    [product.title, product.ownerName]
      .filter(Boolean)
      .some((field) => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDark ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 lg:p-8 transition-colors duration-300 ${
        isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
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
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 w-64 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all duration-200 ${
                isDark
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
            filteredProducts.map((product) => (
              <div
                key={product.productId}
                className={`rounded-xl border shadow flex flex-col transform transition-all duration-300 ease-in-out overflow-hidden ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 hover:shadow-cyan-500/20 hover:border-cyan-400/40'
                    : 'bg-white border-gray-200 hover:shadow-lg hover:border-cyan-400/40'
                } hover:scale-[1.02]`}
              >
                {/* Image Background */}
                <div
                  className="h-40 bg-cover bg-center transition-transform duration-500 ease-in-out hover:scale-105"
                  style={{
                    backgroundImage: `url(${
                      product.images[0] ||
                      'https://via.placeholder.com/400x160?text=No+Image'
                    })`,
                  }}
                />
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ${product.price?.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    by {product.ownerName}
                  </p>
                  <div className="mb-3">{getStatusBadge(product.status)}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                    {product.quantityAvailable || 0} KG in stock
                    <br />
                    Type: {product.type}
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.productId)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">
              No products found.
            </div>
          )}
        </div>

        {/* Product Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
            <div
              className={`max-w-2xl w-full p-6 rounded-xl shadow-lg overflow-y-auto max-h-[90vh] border ${
                isDark
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Product Details</h2>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className={`p-2 rounded-lg ${
                    isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-sm">
                <div><strong>Title:</strong> {selectedProduct.title}</div>
                <div><strong>Owner:</strong> {selectedProduct.ownerName}</div>
                <div><strong>Price:</strong> ${selectedProduct.price?.toFixed(2)}</div>
                <div><strong>Status:</strong> {getStatusBadge(selectedProduct.status)}</div>
                <div><strong>Type:</strong> {selectedProduct.type}</div>
                <div><strong>Stock:</strong> {selectedProduct.quantityAvailable || 0} KG</div>
                <div><strong>Sold:</strong> {selectedProduct.soldQuantity || 0} KG</div>
                <div><strong>Likes:</strong> {selectedProduct.likesCount || 0}</div>
                <div><strong>Average Rating:</strong> {selectedProduct.averageRating || 0} / 5</div>
                <div><strong>Origin Address:</strong> {selectedProduct.originAddress || '-'}</div>
                <div><strong>Description:</strong> {selectedProduct.description || '-'}</div>
                <div>
                  <strong>Comments:</strong>
                  {selectedProduct.comments && selectedProduct.comments.length > 0 ? (
                    <ul className="mt-2 list-disc list-inside space-y-1">
                      {selectedProduct.comments.map((c, i) => (
                        <li key={i} className="text-gray-700 dark:text-gray-300">
                          {c.user ? <strong>{c.user}: </strong> : null}
                          {c.text || c.comment}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span> - </span>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => handleDeleteProduct(selectedProduct.productId)}
                  className="p-2 px-4 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors duration-200 flex items-center gap-2"
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
