import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  ShoppingCart,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button";
import { API_URL } from '../../utils/apiConfig';


const fallbackImage = "https://via.placeholder.com/400";

const ProductModal = ({
  isOpen,
  product,
  onClose,
  onAddToCart,
  onBuyNow,
  refreshProduct,
}) => {
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [liked, setLiked] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (product && product.likedByUser !== undefined) setLiked(product.likedByUser);
    setComment("");
  }, [product]);

  if (!isOpen || !product) return null;

  const totalQuantity = product.initialQuantity ?? product.quantity ?? 0;
  const soldCount = product.soldQuantity ?? 0;
  const availableCount = Math.max(totalQuantity - soldCount, 0);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    if (!token) return alert("Login required to post a review.");
    setIsSubmittingReview(true);
    try {
      const res = await fetch(
        `${API_URL}/api/products/${product.productId}/review`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ comment: comment.trim() }),
        }
      );
      if (!res.ok) throw new Error("Failed to post review");
      setComment("");
      refreshProduct?.();
    } catch (err) {
      console.error(err);
      alert("Failed to post review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleLike = async () => {
    if (!token) return alert("Login required to like.");
    setLikeLoading(true);
    try {
      const res = await fetch(
        `${API_URL}/api/products/${product.productId}/${liked ? "unlike" : "like"}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed");
      setLiked(!liked);
      refreshProduct?.();
    } catch (err) {
      console.error(err);
      alert("Failed to update like.");
    } finally {
      setLikeLoading(false);
    }
  };

  const imageUrl = product.images?.[0] || fallbackImage;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-gradient-to-br from-gray-50 to-gray-200 border border-gray-200 text-gray-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-900 font-inter">
            {product.title}
          </h2>

          {/* Main Image */}
          <motion.img
            src={imageUrl}
            alt={product.title}
            className="w-full h-52 object-cover rounded-lg mb-3 shadow-md"
            onError={(e) => (e.target.src = fallbackImage)}
            whileHover={{ scale: 1.02 }}
          />

          {/* Additional Images */}
          <div className="flex gap-2 overflow-x-auto mb-4">
            {product.images?.slice(1).map((img, i) => (
              <motion.img
                key={i}
                src={img}
                alt={`Product ${i}`}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border border-gray-200 hover:scale-105 transition"
              />
            ))}
          </div>

          {/* Details */}
          <div className="space-y-2 text-sm text-gray-900">
            <p><strong>Price:</strong> {product.price} ETB</p>
            <p><strong>Available:</strong> {availableCount}KG</p>
            <p><strong>Type:</strong> {product.type || "N/A"}</p>
            <p><strong>Origin:</strong> {product.originAddress || "Unknown"}</p>
            <p><strong>Description:</strong> {product.description || "No description"}</p>
          </div>

          {/* Seller */}
          <div className="mt-4 text-center">
            <Link
              to={`/seller/${product.ownerUserId}`}
              className="text-blue-600 font-semibold text-sm underline hover:text-blue-800"
            >
              {product.ownerName || "Unknown Seller"}
            </Link>
          </div>

          {/* Reviews and Likes */}
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-1 text-yellow-500 text-sm">
              <Star className="w-4 h-4 fill-yellow-500" />
              {product.reviews?.length || 0} review
              {product.reviews?.length !== 1 ? "s" : ""}
            </div>

            <Button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-lg transition text-white ${liked
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
                }`}
            >
              {liked ? <ThumbsDown className="w-3 h-3" /> : <ThumbsUp className="w-3 h-3" />}
              {liked ? "Unlike" : "Like"}
            </Button>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 mt-4">
            <Button
              onClick={() => onAddToCart(product)}
              disabled={availableCount <= 0}
              className={`w-full flex justify-center gap-2 text-sm text-white rounded-lg ${availableCount > 0
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-300 cursor-not-allowed text-gray-700"
                }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {availableCount > 0 ? "Add to Cart" : "Sold Out"}
            </Button>

            <Button
              onClick={() => onBuyNow(product)}
              disabled={availableCount <= 0}
              className={`w-full flex justify-center gap-2 text-sm text-white rounded-lg ${availableCount > 0
                  ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  : "bg-gray-300 cursor-not-allowed text-gray-700"
                }`}
            >
              {availableCount > 0 ? "Buy Now" : "Sold Out"}
            </Button>
          </div>

          {/* Reviews Section */}
          <div className="mt-5">
            <h3 className="text-gray-900 text-lg font-semibold mb-2">Reviews</h3>

            <div className="space-y-2 text-sm text-gray-700">
              {product.reviews?.length ? (
                product.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="bg-white border border-gray-200 rounded-lg p-2"
                  >
                    <p className="font-semibold">{review.userName || "Anonymous"}</p>
                    <p>{review.comment}</p>
                    <p className="text-[10px] text-gray-500">
                      {new Date(review.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}

              {/* Add Review */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a review..."
                className="w-full rounded-lg border border-gray-300 bg-white text-gray-900 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={2}
              />
              <Button
                onClick={handleAddComment}
                disabled={isSubmittingReview || !comment.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm mt-1"
              >
                {isSubmittingReview ? "Posting..." : "Post Review"}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;