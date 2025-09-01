import React, { useState, useEffect } from 'react';
import { Package, Eye, Trash2, Search } from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import Card from '../components/common/Card';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState(null);

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
          fetchProducts(); // Refresh products list
          setSelectedProduct(null); // Close modal if open
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
    return status === 'active' ? (
      <span className="bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-500/30 px-3 py-1 rounded-full text-xs font-medium">
        Active
      </span>
    ) : (
      <span className="bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-500/30 px-3 py-1 rounded-full text-xs font-medium">
        {status === 'sold out' ? 'Sold Out' : 'Removed'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96 bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-md min-h-[80vh] flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 rounded-t-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-emerald-500" />
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">
            Product Management
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
            className="w-48 md:w-64 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded-xl mx-4 mt-4">
          {error}
        </div>
      )}

      {/* Product Cards */}
      <div className="flex-1 overflow-x-auto p-4">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.productId}
                className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src={product.images?.[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-1">
                      {product.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">by {product.ownerName}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ${product.price?.toFixed(2)}
                    </span>
                    {getStatusBadge(product.status)}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      {product.quantityAvailable || 0} KG in stock
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-lg">
                      {product.type}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={() => setSelectedProduct(product)}
                      variant="secondary"
                      size="sm"
                      className="flex-1 flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      onClick={() => handleDeleteProduct(product.productId)}
                      variant="danger"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 text-gray-700 dark:text-gray-300">
            No products found.
          </div>
        )}
      </div>

      {/* Product Details Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title="Product Details"
        size="lg"
      >
        {selectedProduct && (
          <div className="space-y-6">
            <div className="flex gap-6">
              <img
                src={selectedProduct.images?.[0] || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'}
                alt={selectedProduct.title}
                className="w-48 h-48 object-cover rounded-xl"
              />
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {selectedProduct.title}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">by {selectedProduct.ownerName}</p>
                </div>

                <div className="space-y-2">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    ${selectedProduct.price?.toFixed(2)}
                  </div>
                  {getStatusBadge(selectedProduct.status)}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Type: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedProduct.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Stock: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedProduct.quantityAvailable || 0} KG</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Sold: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedProduct.soldQuantity || 0} KG</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Likes: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedProduct.likesCount || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Average Rating: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedProduct.averageRating || 0} / 5</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-gray-400">Origin Address: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedProduct.originAddress || '-'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-gray-400">Description: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedProduct.description || '-'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 dark:text-gray-400">Comment: </span>
                    <span className="text-gray-900 dark:text-gray-100">{selectedProduct.comment || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleDeleteProduct(selectedProduct.productId)}
                variant="danger"
              >
                Delete Product
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Products;