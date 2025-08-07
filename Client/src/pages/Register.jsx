// import React, { useState } from 'react'
// import { Link, useNavigate } from 'react-router-dom'
// import { motion } from 'framer-motion'
// import { Eye, EyeOff, Leaf, ArrowRight, User, Building, ShoppingCart, Users } from 'lucide-react'
// import { useAuth } from '../contexts/AuthContext'
// import Button from '../components/common/Button'
// import Input from '../components/common/Input'
// import Card from '../components/common/Card'
// import toast from 'react-hot-toast'

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     role: 'farmer',
//     phone: '',
//     location: '',
//     nationalId: '',
//     agreeToTerms: false
//   })
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
  
//   const { register } = useAuth()
//   const navigate = useNavigate()

//   const userRoles = [
//     {
//       value: 'farmer',
//       label: 'Farmer',
//       icon: User,
//       description: 'Grow and sell agricultural products'
//     },
//     {
//       value: 'distributor',
//       label: 'Distributor',
//       icon: Building,
//       description: 'Distribute products to retailers'
//     },
//     {
//       value: 'retailer',
//       label: 'Retailer',
//       icon: ShoppingCart,
//       description: 'Sell products to consumers'
//     },
//     {
//       value: 'consumer',
//       label: 'Consumer',
//       icon: Users,
//       description: 'Purchase agricultural products'
//     }
//   ]

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     if (formData.password !== formData.confirmPassword) {
//       toast.error('Passwords do not match')
//       return
//     }

//     if (!formData.agreeToTerms) {
//       toast.error('Please agree to the terms and conditions')
//       return
//     }

//     setIsLoading(true)

//     try {
//       const result = await register(formData)
      
//       if (result.success) {
//         toast.success('Registration successful! Please check your email for verification.')
//         navigate('/login')
//       } else {
//         toast.error(result.error)
//       }
//     } catch (error) {
//       toast.error('Registration failed. Please try again.')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-8"
//         >
//           <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
//             <Leaf className="h-10 w-10 text-emerald-600" />
//             <span className="text-2xl font-bold text-gray-900">
//               AgroChain Ethiopia
//             </span>
//           </Link>
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">
//             Join AgroChain Ethiopia
//           </h2>
//           <p className="text-gray-600">
//             Create your account and start transforming agriculture
//           </p>
//         </motion.div>

//         {/* Registration Form */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6, delay: 0.2 }}
//         >
//           <Card>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Role Selection */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                   I am a <span className="text-red-500">*</span>
//                 </label>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {userRoles.map((role) => (
//                     <div key={role.value}>
//                       <input
//                         type="radio"
//                         id={role.value}
//                         name="role"
//                         value={role.value}
//                         checked={formData.role === role.value}
//                         onChange={handleInputChange}
//                         className="sr-only"
//                       />
//                       <label
//                         htmlFor={role.value}
//                         className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
//                           formData.role === role.value
//                             ? 'border-emerald-500 bg-emerald-50'
//                             : 'border-gray-200 hover:border-gray-300'
//                         }`}
//                       >
//                         <role.icon className={`h-6 w-6 mr-3 ${
//                           formData.role === role.value ? 'text-emerald-600' : 'text-gray-400'
//                         }`} />
//                         <div>
//                           <div className={`font-medium ${
//                             formData.role === role.value ? 'text-emerald-900' : 'text-gray-900'
//                           }`}>
//                             {role.label}
//                           </div>
//                           <div className={`text-sm ${
//                             formData.role === role.value ? 'text-emerald-600' : 'text-gray-500'
//                           }`}>
//                             {role.description}
//                           </div>
//                         </div>
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Personal Information */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                   label="Full Name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter your full name"
//                 />
//                 <Input
//                   label="Email Address"
//                   name="email"
//                   type="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="Enter your email"
//                 />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <Input
//                   label="Phone Number"
//                   name="phone"
//                   type="tel"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="+251 911 123 456"
//                 />
//                 <Input
//                   label="Location"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                   required
//                   placeholder="City, Region"
//                 />
//               </div>

//               <Input
//                 label="Ethiopian National ID"
//                 name="nationalId"
//                 value={formData.nationalId}
//                 onChange={handleInputChange}
//                 required
//                 placeholder="Enter your National ID number"
//               />

//               {/* Password Fields */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="relative">
//                   <Input
//                     label="Password"
//                     name="password"
//                     type={showPassword ? 'text' : 'password'}
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="Create a password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5" />
//                     ) : (
//                       <Eye className="h-5 w-5" />
//                     )}
//                   </button>
//                 </div>

//                 <div className="relative">
//                   <Input
//                     label="Confirm Password"
//                     name="confirmPassword"
//                     type={showConfirmPassword ? 'text' : 'password'}
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     required
//                     placeholder="Confirm your password"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
//                   >
//                     {showConfirmPassword ? (
//                       <EyeOff className="h-5 w-5" />
//                     ) : (
//                       <Eye className="h-5 w-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               {/* Terms and Conditions */}
//               <div className="flex items-start">
//                 <input
//                   id="agreeToTerms"
//                   name="agreeToTerms"
//                   type="checkbox"
//                   checked={formData.agreeToTerms}
//                   onChange={handleInputChange}
//                   className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded mt-1"
//                 />
//                 <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-900">
//                   I agree to the{' '}
//                   <Link to="/terms" className="text-emerald-600 hover:text-emerald-500">
//                     Terms and Conditions
//                   </Link>{' '}
//                   and{' '}
//                   <Link to="/privacy" className="text-emerald-600 hover:text-emerald-500">
//                     Privacy Policy
//                   </Link>
//                 </label>
//               </div>

//               <Button
//                 type="submit"
//                 loading={isLoading}
//                 className="w-full group"
//                 size="large"
//               >
//                 Create Account
//                 <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
//               </Button>
//             </form>

//             <div className="mt-6">
//               <div className="relative">
//                 <div className="absolute inset-0 flex items-center">
//                   <div className="w-full border-t border-gray-300" />
//                 </div>
//                 <div className="relative flex justify-center text-sm">
//                   <span className="px-2 bg-white text-gray-500">
//                     Already have an account?
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-6">
//                 <Link to="/login">
//                   <Button variant="outline" className="w-full">
//                     Sign In
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </Card>
//         </motion.div>
//       </div>
//     </div>
//   )
// }

// export default Register