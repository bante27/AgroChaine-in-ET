import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from '../utils/apiConfig';

import {
  FaPhone,
  FaMapMarkerAlt,
  FaMedal,
  FaCheckCircle,
  FaStar,
  FaCalendarAlt,
  FaBoxOpen,
  FaShoppingCart,
  FaHeart,
} from "react-icons/fa";

const SellerProfile = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [postedProducts, setPostedProducts] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      setLoading(true);
      setError(null);
      try {
        const resSeller = await axios.get(`${API_URL}/api/users/${id}`);
        if (resSeller.data.success) {
          setSeller(resSeller.data.user);
          setPostedProducts(resSeller.data.user.postedProducts || []);
        } else {
          setError("Seller not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch seller info");
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, [id]);

  const getProductAvgRating = (product) => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const sum = product.reviews.reduce((a, r) => a + (r.rating || 0), 0);
    return (sum / product.reviews.length).toFixed(1);
  };

  const toggleReviews = (productId) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading seller info...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!seller) return <p className="text-center mt-10 text-gray-700">No seller info available.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Seller Info Card */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl shadow-xl border border-white/20 bg-white/30 backdrop-blur-md transition-shadow duration-300 hover:shadow-2xl">
          <img
            src={seller.profilePic ? seller.profilePic : "https://via.placeholder.com/150"}
            alt={seller.fullName}
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-gray-300 shadow-lg"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 drop-shadow-sm">{seller.fullName}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-gray-800 text-base">
              <p className="flex items-center gap-2"><FaPhone className="text-gray-500" /> {seller.phone || "N/A"}</p>
              <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-gray-500" /> {seller.address || "N/A"}</p>
              <p className="flex items-center gap-2"><FaMedal className="text-gray-500" /> Rank: {seller.rank ?? "N/A"}</p>
              <p className="flex items-center gap-2"><FaCheckCircle className="text-gray-500" /> Verified: {seller.verified ? "Yes" : "No"}</p>
              <p className="flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                Avg Rating: {postedProducts.length > 0
                  ? (postedProducts.reduce((acc, p) => acc + parseFloat(getProductAvgRating(p)), 0) / postedProducts.length).toFixed(1)
                  : 0}
              </p>
              <p className="flex items-center gap-2"><FaCalendarAlt className="text-gray-500" /> Joined: {new Date(seller.registrationDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Posted Products Grid */}
        <div className="p-6 rounded-3xl shadow-xl border border-white/20 bg-white/30 backdrop-blur-md transition-shadow duration-300 hover:shadow-2xl">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900 drop-shadow-sm">Posted Products</h2>
          {postedProducts.length === 0 ? (
            <p className="text-gray-800 text-center py-6 text-lg">No products posted yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {postedProducts.map((prod) => {
                // Calculate sold and available properly
                const totalQuantity = prod.initialQuantity ?? 0;
                const soldCount = prod.soldQuantity ?? 0;
                const availableCount = Math.max(totalQuantity - soldCount, 0);

                // Reviews and likes
                const reviewsCount = prod.reviews?.length ?? 0;
                const likesCount = prod.likesCount ?? 0;
                const isExpanded = expandedReviews[prod._id] || false;
                const reviewsToShow = isExpanded ? prod.reviews : prod.reviews?.slice(0, 1) || [];

                return (
                  <div key={prod._id} className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden">
                    <div className="relative group overflow-hidden">
                      <img
                        src={prod.images?.[0] || "https://via.placeholder.com/300"}
                        alt={prod.title}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-semibold shadow-md ${availableCount > 0 ? "bg-green-600 text-white" : "bg-red-600 text-white"
                        }`}>
                        {availableCount > 0 ? `Available: ${availableCount}` : "Sold Out"}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col gap-2">
                      <h3 className="text-xl font-semibold text-gray-900">{prod.title}</h3>
                      <p className="text-gray-800 text-sm">{prod.price ? `${prod.price} ETB` : "Price N/A"}</p>
                      <div className="flex justify-between text-xs text-gray-700 mt-2">
                        <span className="flex items-center gap-1"><FaShoppingCart /> {soldCount} Sold</span>
                        <span className="flex items-center gap-1"><FaBoxOpen /> {availableCount} Available</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-700 mt-1">
                        <span className="flex items-center gap-1 text-red-500"><FaHeart /> {likesCount} Likes</span>
                        <span className="flex items-center gap-1 text-yellow-500">
                          <FaStar /> {getProductAvgRating(prod)} ({reviewsCount})
                        </span>
                      </div>
                      {reviewsCount > 0 && (
                        <div className="mt-3 border-t border-white/30 pt-2">
                          {reviewsToShow.map((rev, i) => (
                            <div key={i} className="mb-1 bg-white/20 p-2 rounded text-xs text-gray-800">
                              <p className="font-semibold">{rev.userName || "Anonymous"}</p>
                              <p>{rev.comment}</p>
                            </div>
                          ))}
                          {reviewsCount > 1 && (
                            <button
                              className="text-gray-800 text-xs hover:underline mt-1"
                              onClick={() => toggleReviews(prod._id)}
                            >
                              {isExpanded ? "See less" : `See all (${reviewsCount})`}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
