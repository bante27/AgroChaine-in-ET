import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ShoppingCart, ThumbsUp, ThumbsDown } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../common/Button";

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
    if (product && product.likedByUser !== undefined) {
      setLiked(product.likedByUser);
    }
    setComment("");
  }, [product]);

  if (!isOpen || !product) return null;

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    if (!token) return alert("Login required to post a review.");
    setIsSubmittingReview(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/products/${product.productId}/review`,
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
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl text-black w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 md:p-6 relative shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Product Title */}
          <h2 className="text-2xl font-bold mb-4">{product.title}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Images */}
            <div>
              <img
                src={
                  product.images?.[0]
                    ? `http://localhost:5000${product.images[0]}`
                    : "https://via.placeholder.com/300"
                }
                alt={product.title}
                className="w-full h-64 md:h-72 object-cover rounded-lg mb-3"
              />
              <div className="flex overflow-x-auto gap-2">
                {product.images?.slice(1).map((img, i) => (
                  <img
                    key={i}
                    src={`http://localhost:5000${img}`}
                    alt={`${product.title} ${i + 2}`}
                    className="w-20 h-20 object-cover rounded flex-shrink-0"
                  />
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              <p>
                <strong>Price:</strong> {product.price ? `${product.price} ETB` : "N/A"} per kg
              </p>
              <p><strong>Quantity:</strong> {product.quantity || "N/A"} kg</p>
              <p><strong>Type:</strong> {product.type || "N/A"}</p>
              <p><strong>Origin:</strong> {product.originAddress || "Unknown"}</p>
              <p><strong>Description:</strong> {product.description || "No description"}</p>

              {/* Seller Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg shadow-sm flex items-center gap-3">
                <div>
                  <Link
                    to={`/seller/${product.ownerUserId}`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    {product.seller?.fullName || product.ownerName || "Unknown Seller"}
                  </Link>
                </div>
              </div>

              {/* Reviews & Likes */}
              <div className="flex items-center space-x-3 mt-3">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span>
                  {product.reviews?.length || 0} review
                  {product.reviews?.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex items-center space-x-3 mt-2">
                <Button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`flex items-center space-x-2 ${
                    liked ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {liked ? <ThumbsDown className="h-4 w-4" /> : <ThumbsUp className="h-4 w-4" />}
                  <span>{liked ? "Unlike" : "Like"}</span>
                </Button>
              </div>

              {/* Add to Cart / Buy */}
              <Button
                onClick={() => onAddToCart(product)}
                disabled={product.quantity <= 0}
                className="w-full mt-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.quantity > 0 ? "Add to Cart" : "Add to Cart"}
              </Button>
              <Button
                onClick={() => onBuyNow(product)}
                disabled={product.quantity <= 0}
                className="w-full mt-1 bg-zinc-500 hover:bg-rose-400"
              >
                Buy Now
              </Button>

              {/* Reviews Section */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Reviews</h3>
                <div className="space-y-3">
                  {!product.reviews || product.reviews.length === 0 ? (
                    <p className="text-gray-600">No reviews yet.</p>
                  ) : (
                    product.reviews.map((review) => (
                      <div key={review._id} className="p-3 bg-gray-100 rounded-lg flex gap-3">
                        <div>
                          <p className="font-medium text-gray-800">{review.userName || "Anonymous"}</p>
                          <p className="text-sm text-gray-600">{review.comment}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(review.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Add Review */}
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write a review..."
                    className="w-full rounded-lg border-gray-300 p-2 mt-2"
                    rows={3}
                  />
                  <Button
                    onClick={handleAddComment}
                    disabled={isSubmittingReview || !comment.trim()}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmittingReview ? "Posting..." : "Post Review"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
