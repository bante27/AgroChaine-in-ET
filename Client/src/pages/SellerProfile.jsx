import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from '../utils/apiConfig';
import { useLanguage } from "../contexts/LanguageContext";
import { motion } from "framer-motion";
import { FaPhone, FaMapMarkerAlt, FaMedal, FaCheckCircle, FaStar, FaCalendarAlt, FaArrowLeft, FaExclamationCircle, FaBoxOpen } from "react-icons/fa";

const SellerProfile = () => {
  const { t, language, transliterateName } = useLanguage();
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [postedProducts, setPostedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      setLoading(true);
      try {
        // 1. Get seller details
        const resSeller = await axios.get(`${API_URL}/api/users/${id}`);
        if (!resSeller.data.success) throw new Error("User not found");
        const sellerData = resSeller.data.user;

        // 2. Get products – either from populated postedProducts or separate API
        let products = [];
        if (sellerData.postedProducts && sellerData.postedProducts.length) {
          // If user object already contains posted products (populated)
          products = sellerData.postedProducts;
        } else {
          // Fallback: fetch products by ownerUserId
          const resProducts = await axios.get(`${API_URL}/api/products?ownerUserId=${id}`);
          products = resProducts.data.products || [];
        }
        setSeller(sellerData);
        setPostedProducts(products);
      } catch (err) {
        console.error(err);
        setError(err.message === "User not found" ? "Seller not found" : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, [id]);

  const getProductAvgRating = (product) => {
    if (!product.reviews || product.reviews.length === 0) return "0.0";
    const sum = product.reviews.reduce((a, r) => a + (r.rating || 0), 0);
    return (sum / product.reviews.length).toFixed(1);
  };

  const displayName = (name) => (language === 'am' ? transliterateName(name || "") : name);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-500">Loading profile...</p>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <FaExclamationCircle className="text-red-500 w-16 h-16 mb-4" />
      <p className="text-xl font-bold">{error}</p>
      <Link to="/marketplace" className="mt-4 text-emerald-600 flex items-center gap-2"><FaArrowLeft /> Back to Marketplace</Link>
    </div>
  );

  const avgRating = postedProducts.length
    ? (postedProducts.reduce((acc, p) => acc + parseFloat(getProductAvgRating(p)), 0) / postedProducts.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-gray-600 mb-6 hover:text-emerald-600 transition-colors">
          <FaArrowLeft size={14} /> Back
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 mb-10">
          <div className="relative">
            <img src={seller.profilePic || "https://via.placeholder.com/150"} className="w-32 h-32 md:w-44 md:h-44 rounded-2xl object-cover bg-gray-100 border-4 border-white shadow" alt={seller.fullName} />
            {seller.govIdStatus === 'approved' && (
              <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-4 border-white">
                <FaCheckCircle size={20} />
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{displayName(seller.fullName)}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 text-sm text-gray-600 mb-6">
              <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full"><FaMapMarkerAlt className="text-emerald-500" /> {seller.address || "N/A"}</span>
              <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full"><FaCalendarAlt className="text-blue-500" /> Joined {new Date(seller.createdAt || seller.registrationDate).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full font-bold text-emerald-700"><FaMedal /> {seller.rank || "Bronze"}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t pt-6">
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-black">Rating</p>
                <p className="text-xl font-bold flex items-center justify-center md:justify-start gap-1"><FaStar className="text-yellow-500" /> {avgRating}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-black">Products</p>
                <p className="text-xl font-bold">{postedProducts.length}</p>
              </div>
              <div>
                <p className="text-[11px] text-gray-400 uppercase font-black">Phone</p>
                <p className="text-sm font-bold text-emerald-600">{seller.phone || "Private"}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><span className="w-2 h-8 bg-emerald-500 rounded-full"></span> Products for Sale</h2>
        {postedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-gray-200">
            <FaBoxOpen className="text-gray-300 mx-auto text-5xl mb-4" />
            <p className="text-gray-400 italic">No products listed yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {postedProducts.map(prod => (
              <div key={prod._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition">
                <img src={prod.images?.[0] || "https://via.placeholder.com/300"} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" alt={prod.title} />
                <div className="p-5">
                  <Link to={`/product/${prod._id}`} className="hover:text-emerald-600 transition-colors font-bold text-lg">{displayName(prod.title)}</Link>
                  <p className="text-xl font-black text-emerald-600 mt-2">{prod.price} ETB</p>
                  <div className="mt-4 pt-4 border-t flex justify-between text-xs text-gray-400">
                    <span>⭐ {getProductAvgRating(prod)}</span>
                    <span>📦 {prod.quantityAvailable || 0} left</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfile;