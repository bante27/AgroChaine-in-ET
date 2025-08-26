import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const SellerProfile = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [postedProducts, setPostedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch seller info
        const resSeller = await axios.get(`http://localhost:5000/api/users/${id}`);
        if (resSeller.data.success) {
          setSeller(resSeller.data.user);

          // Fetch seller's posted products
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

  return (
    <div className="min-h-screen bg-white text-black px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Seller Info */}
        <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded shadow-md">
          <img
            src={
              seller.profilePic
                ? `http://localhost:5000${seller.profilePic}`
                : "https://via.placeholder.com/80"
            }
            alt={seller.fullName}
            className="w-20 h-20 rounded-full object-cover border"
          />
          <div>
            <h1 className="text-2xl font-bold text-black">{seller.fullName}</h1>
            <p className="text-black">📞 Phone: {seller.phone || "N/A"}</p>
            <p className="text-black">📍 Address: {seller.address || "N/A"}</p>
            <p className="text-black">🏅 Rank: {seller.rank || "N/A"}</p>
            <p className="text-black">✅ Verified: {seller.verified ? "Yes" : "No"}</p>
            <p className="text-black">📅 Joined: {new Date(seller.registrationDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Posted Products */}
        <div className="mt-6 bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black">Posted Products</h2>
          {postedProducts.length === 0 ? (
            <p className="text-gray-800">No products posted yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {postedProducts.map((prod) => (
                <div key={prod._id} className="border p-3 rounded-lg shadow-sm bg-white">
                  <img
                    src={prod.images?.[0] ? `http://localhost:5000${prod.images[0]}` : "https://via.placeholder.com/150"}
                    alt={prod.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                  <h3 className="font-semibold text-black">{prod.title}</h3>
                  <p className="text-black">{prod.price ? `${prod.price} ETB` : "Price N/A"}</p>
                  {/* <Link
                    to={`/product/${prod.productId}`}
                    className="text-blue-600 hover:underline mt-2 block"
                  >
                    View Product
                  </Link> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
