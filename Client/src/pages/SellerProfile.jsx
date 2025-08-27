import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { 
  FaPhone, FaMapMarkerAlt, FaMedal, FaCheckCircle, 
  FaStar, FaCalendarAlt, FaBoxOpen, FaShoppingCart, FaHeart 
} from "react-icons/fa";

const SellerProfile = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [postedProducts, setPostedProducts] = useState([]);
  const [expandedReviews, setExpandedReviews] = useState({}); // track expanded reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      setLoading(true);
      setError(null);
      try {
        const resSeller = await axios.get(`http://localhost:5000/api/users/${id}`);
        if (resSeller.data.success) {
          setSeller(resSeller.data.user);

          if (resSeller.data.user.postedProducts?.length > 0) {
            const productIds = resSeller.data.user.postedProducts.map(p => p._id);
            const resProducts = await axios.get(
              `http://localhost:5000/api/products?ids=${productIds.join(",")}`
            );
            setPostedProducts(resProducts.data.products || []);
          }
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

  if (loading) return <p>Loading seller info...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!seller) return <p>No seller info available.</p>;

  const averageRating =
    postedProducts.length > 0
      ? (
          postedProducts.reduce((acc, p) => {
            const sum = p.reviews?.length > 0 ? p.reviews.reduce((a, r) => a + (r.rating || 0), 0) : 0;
            return acc + (sum / (p.reviews.length || 1));
          }, 0) / postedProducts.length
        ).toFixed(1)
      : 0;

  const formatDate = dateStr => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  };

  const toggleReviews = (productId) => {
    setExpandedReviews(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="max-w-6xl mx-auto">

        {/* Seller Info */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8 bg-gradient-to-r from-emerald-50 to-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow">
          <img
            src={seller.profilePic ? `http://localhost:5000${seller.profilePic}` : "https://via.placeholder.com/100"}
            alt={seller.fullName}
            className="w-28 h-28 rounded-full object-cover border-4 border-emerald-500 shadow-md"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{seller.fullName}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-700 text-sm">
              <p className="flex items-center gap-2"><FaPhone className="text-emerald-500"/> {seller.phone || "N/A"}</p>
              <p className="flex items-center gap-2"><FaMapMarkerAlt className="text-emerald-500"/> {seller.address || "N/A"}</p>
              <p className="flex items-center gap-2"><FaMedal className="text-emerald-500"/> Rank: {seller.rank || "N/A"}</p>
              <p className="flex items-center gap-2"><FaCheckCircle className="text-emerald-500"/> Verified: {seller.verified ? "Yes" : "No"}</p>
              <p className="flex items-center gap-2"><FaStar className="text-yellow-400"/> Avg Rating: {averageRating}</p>
              <p className="flex items-center gap-2"><FaCalendarAlt className="text-emerald-500"/> Joined: {formatDate(seller.registrationDate)}</p>
            </div>
          </div>
        </div>

        {/* Posted Products */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Posted Products</h2>
          {postedProducts.length === 0 ? (
            <p className="text-gray-800">No products posted yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {postedProducts.map(prod => {
                const prodAvgRating =
                  prod.reviews?.length > 0
                    ? (prod.reviews.reduce((a, r) => a + (r.rating || 0), 0) / prod.reviews.length).toFixed(1)
                    : 0;

                const isExpanded = expandedReviews[prod._id] || false;
                // Show first review only by default
                const reviewsToShow = isExpanded ? prod.reviews : prod.reviews?.slice(0, 1);

                return (
                  <div
                    key={prod._id}
                    className="bg-white border rounded-2xl shadow hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <div className="relative">
                      <img
                        src={prod.images?.[0] ? `http://localhost:5000${prod.images[0]}` : "https://via.placeholder.com/200"}
                        alt={prod.title}
                        className="w-full h-52 object-cover"
                      />
                      <span className={`absolute top-2 left-2 text-xs px-2 py-1 rounded-full ${prod.quantityAvailable > 0 ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                        {prod.quantityAvailable > 0 ? "Available" : "Sold Out"}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{prod.title}</h3>
                      <p className="text-gray-800 mb-3">{prod.price ? `${prod.price} ETB` : "Price N/A"}</p>

                      <div className="flex justify-between text-sm text-gray-600 mb-3">
                        <span className="flex items-center gap-1"><FaShoppingCart/> {prod.soldQuantity || 0} Sold</span>
                        <span className="flex items-center gap-1"><FaBoxOpen/> {prod.quantityAvailable || 0} Available</span>
                      </div>

                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1"><FaHeart className="text-red-500"/> {prod.likesCount || 0} Likes</span>
                        <span className="flex items-center gap-1 text-yellow-500">
                          <FaStar/> {prodAvgRating} ({prod.reviews?.length || 0})
                        </span>
                      </div>

                      {/* Reviews */}
                      {prod.reviews?.length > 0 && (
                        <div className="mt-3 border-t pt-2">
                          <h4 className="text-gray-800 font-semibold mb-2">Reviews</h4>

                          {reviewsToShow.map((rev, i) => (
                            <div key={i} className="mb-2 bg-gray-50 p-2 rounded">
                              <p className="text-sm text-gray-500 font-semibold">{rev.userName || "Anonymous"}</p>
                              <p className="text-sm text-gray-700">⭐ {rev.rating || 0} - {rev.comment}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(rev.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                              </p>
                            </div>
                          ))}

                          {/* Show toggle only if more than 1 review */}
                          {prod.reviews.length > 1 && (
                            <button
                              className="text-blue-600 text-sm hover:underline"
                              onClick={() => toggleReviews(prod._id)}
                            >
                              {isExpanded ? "See less" : "See all"}
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
