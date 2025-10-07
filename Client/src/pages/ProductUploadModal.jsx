// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import Button from "./common/Button";

// const ProductUploadModal = ({ isOpen, onClose, onSubmit }) => {
//   const [product, setProduct] = useState({
//     name: "",
//     price: "",
//     origin: "",
//     quantity: "",
//     type: "",
//     description: "",
//     productImage: null,
//   });

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setProduct((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit(product);
//     setProduct({
//       name: "",
//       price: "",
//       origin: "",
//       quantity: "",
//       type: "",
//       description: "",
//       productImage: null,
//     });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/60 dark:bg-black/70 z-50 px-3 sm:px-6">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.85 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.3 }}
//         className="w-full max-w-sm sm:max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-5 sm:p-6"
//       >
//         <h2 className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4 text-center">
//           Upload Product
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
//           {/* Product Name */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//               Product Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={product.name}
//               onChange={handleChange}
//               className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//               required
//             />
//           </div>

//           {/* Price */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//               Price (ETB)
//             </label>
//             <input
//               type="number"
//               name="price"
//               value={product.price}
//               onChange={handleChange}
//               className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//               required
//             />
//           </div>

//           {/* Origin */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//               Origin (Place)
//             </label>
//             <input
//               type="text"
//               name="origin"
//               value={product.origin}
//               onChange={handleChange}
//               className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//               required
//             />
//           </div>

//           {/* Quantity */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//               Quantity (kg)
//             </label>
//             <input
//               type="number"
//               name="quantity"
//               value={product.quantity}
//               onChange={handleChange}
//               className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//               required
//             />
//           </div>

//           {/* Type */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//               Type (e.g., Grain, Vegetable)
//             </label>
//             <input
//               type="text"
//               name="type"
//               value={product.type}
//               onChange={handleChange}
//               className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//               required
//             />
//           </div>

//           {/* Description */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//               Description
//             </label>
//             <textarea
//               name="description"
//               value={product.description}
//               onChange={handleChange}
//               rows="3"
//               className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm p-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
//             ></textarea>
//           </div>

//           {/* Product Image */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//               Product Image
//             </label>
//             <input
//               type="file"
//               name="productImage"
//               accept="image/*"
//               onChange={handleChange}
//               className="mt-1 w-full text-gray-700 dark:text-gray-300 text-sm"
//               required
//             />
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-end space-x-2 sm:space-x-3 mt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-sm rounded-lg border border-gray-400 text-gray-800 dark:text-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
//             >
//               Upload
//             </button>
//           </div>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default ProductUploadModal;
