import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShoppingCart } from 'lucide-react';
import Button from '../../components/common/Button';

const ProductModal = ({ isOpen, onClose, product, onAddToCart, onBuyNow }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setComments([...comments, { text: newComment, user: 'Current User' }]);
    setNewComment('');
  };

  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4">{product.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={
                    product.images && product.images.length > 0
                      ? `http://localhost:5000${product.images[0]}`
                      : 'https://via.placeholder.com/300'
                  }
                  alt={product.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="flex overflow-x-auto gap-2">
                  {product.images && product.images.slice(1).map((img, i) => (
                    <img
                      key={i}
                      src={`http://localhost:5000${img}`}
                      alt={`${product.title} image ${i + 2}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p><strong>Product ID:</strong> {product.productId || 'N/A'}</p>
                <p><strong>Price:</strong> {product.price ? `${product.price} ETB` : 'N/A'} per kg</p>
                <p><strong>Quantity:</strong> {product.quantity || 'N/A'} kg</p>
                <p><strong>Type:</strong> {product.type || 'N/A'}</p>
                <p><strong>Origin Address:</strong> {product.originAddress || 'Unknown'}</p>
                <p><strong>Seller:</strong> {product.owner?.fullName || product.owner?.username || 'Unknown Seller'}</p>
                <p><strong>Seller ID:</strong> {product.owner?.userId || 'N/A'}</p>
                <p><strong>Description:</strong> {product.description || 'No description available'}</p>
                <p><strong>Comment:</strong> {product.comment || 'No comment'}</p>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span>{product.rating || '0'} ({product.reviews || '0'} reviews)</span>
                </div>
                <Button
                  onClick={() => onAddToCart(product)}
                  disabled={product.quantity <= 0}
                  className="w-full mt-4"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  onClick={() => onBuyNow(product)}
                  disabled={product.quantity <= 0}
                  className="w-full mt-2 bg-green-600 hover:bg-green-700"
                >
                  Buy Now
                </Button>

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
  );
};

export default ProductModal;