import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ShoppingCart, ThumbsUp, ThumbsDown } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button";

const ProductModal = ({ isOpen, product, onClose, onAddToCart, onBuyNow, refreshProduct }) => {
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
      const res = await fetch(`http://localhost:5000/api/products/${product.productId}/review`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ comment: comment.trim() }),
      });
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
        `http://localhost:5000/api/products/${product.productId}/${liked ? "unlike" : "like"}`,
        { method: "POST", headers: { Authorization: `Bearer ${token}` } }
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

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-4 md:p-5 relative shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Product Title */}
          <h2 className="text-xl font-bold mb-3 text-gray-800 text-center truncate">{product.title}</h2>

          {/* Images */}
          <motion.img
            src={product.images?.[0] ? `http://localhost:5000${product.images[0]}` : "https://via.placeholder.com/400"}
            alt={product.title}
            className="w-full h-48 object-cover rounded-lg mb-2 shadow-sm"
            whileHover={{ scale: 1.02 }}
          />
          <div className="flex overflow-x-auto gap-2 mb-3">
            {product.images?.slice(1).map((img, i) => (
              <motion.img
                key={i}
                src={`http://localhost:5000${img}`}
                alt={`${product.title} ${i + 2}`}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0 cursor-pointer shadow-sm hover:scale-105 transition-transform"
              />
            ))}
          </div>

          {/* Details */}
          <div className="text-gray-700 text-sm space-y-1 mb-3">
            <p><strong>Price:</strong> {product.price ? `${product.price} ETB` : "N/A"}</p>
            <p><strong>Quantity:</strong> {availableCount}</p>
            <p><strong>Type:</strong> {product.type || "N/A"}</p>
            <p><strong>Origin:</strong> {product.originAddress || "Unknown"}</p>
            <p><strong>Description:</strong> {product.description || "No description"}</p>
          </div>

          {/* Seller */}
          <div className="mb-3 text-center">
            <Link
              to={`/seller/${product.ownerUserId}`}
              className="text-blue-600 font-semibold hover:underline text-sm"
            >
              {product.seller?.fullName || product.ownerName || "Unknown Seller"}
            </Link>
          </div>

          {/* Reviews & Likes */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1 text-yellow-500 text-sm">
              <Star className="h-4 w-4" />
              <span>{product.reviews?.length || 0} review{product.reviews?.length > 1 ? "s" : ""}</span>
            </div>

            <Button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-1 px-2 py-1 text-xs text-white rounded-lg transition ${
                liked ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {liked ? <ThumbsDown className="h-3 w-3" /> : <ThumbsUp className="h-3 w-3" />}
              <span>{liked ? "Unlike" : "Like"}</span>
            </Button>
          </div>

          {/* Add to Cart / Buy */}
          <div className="flex flex-col gap-2 mb-4">
            <Button
              onClick={() => onAddToCart(product)}
              disabled={availableCount <= 0}
              className="w-full flex items-center justify-center gap-2 text-xs bg-green-600 hover:bg-green-700"
            >
              <ShoppingCart className="h-4 w-4" /> {availableCount > 0 ? "Add to Cart" : "Sold Out"}
            </Button>
            <Button
              onClick={() => onBuyNow(product)}
              disabled={availableCount <= 0}
              className="w-full flex items-center justify-center gap-2 text-xs bg-orange-500 hover:bg-orange-600"
            >
              {availableCount > 0 ? "Buy Now" : "Sold Out"}
            </Button>
          </div>

          {/* Reviews Section (logic intact) */}
          <div className="mt-2">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Reviews</h3>
            <div className="space-y-2 text-xs">
              {!product.reviews || product.reviews.length === 0 ? (
                <p className="text-gray-500">No reviews yet.</p>
              ) : (
                product.reviews.map((review) => (
                  <div key={review._id} className="p-2 bg-gray-100 rounded-lg flex flex-col gap-1">
                    <p className="font-medium text-gray-800">{review.userName || "Anonymous"}</p>
                    <p className="text-gray-600">{review.comment}</p>
                    <p className="text-gray-400">{new Date(review.createdAt).toLocaleString()}</p>
                  </div>
                ))
              )}

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a review..."
                className="w-full rounded-lg border border-gray-300 p-1 resize-none focus:ring-1 focus:ring-blue-400 focus:outline-none text-xs"
                rows={2}
              />
              <Button
                onClick={handleAddComment}
                disabled={isSubmittingReview || !comment.trim()}
                className="mt-1 w-full bg-blue-600 hover:bg-blue-700 text-xs"
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
