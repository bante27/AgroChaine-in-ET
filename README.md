# AgroChain Ethiopia - National ID-Integrated Food Traceability Platform

## Project Overview
AgroChain Ethiopia is a comprehensive food traceability platform that integrates with Ethiopia's National ID system to create transparency, trust, and efficiency in the food supply chain. The platform connects farmers, distributors, retailers, and consumers through advanced technology.

## Project Structure

```
AgroChain-Ethiopia/
├── Agrochain-New/
├── Client/
├── tsconfig.node.json
├── vite.config.ts
├── server.config.js
├── package-lock.json
├── package.json
├── index.html
├── .gitignore
├── .eslintrc.js
├── .env
├── README.md
├── public/
│   ├── assets/
│   │   ├── images/
│   │   ├── videos/
│   │   
│   ├
│   └
├── src/
│   ├── admin.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.tsx
│   ├── vite-env.d.ts
│   ├── env/
│   │   ├── .env
│   │   └── gitignore
│   ├── assets/
│   │   ├── common/
│   │   │   ├── layout/
│   │   │   │   ├── AuthModal.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── CartSidebar.jsx
│   │   │   │   ├── CheckoutModal.jsx
│   │   │   │   ├── FiltersSection.jsx
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   ├── ProductModal.jsx
│   │   │   │   ├── ProductsDisplay.jsx
│   │   │   │   └── useCart.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── LiveChat.jsx
│   │   │   ├── PaymentModal.jsx
│   │   │   ├── ProfileImageUploadModal.jsx
│   │   │   ├── VerificationModal.jsx
│   │   └── components/
│   ├── components/
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── pages/
│   │   │       ├── About.jsx
│   │   │       ├── Contact.jsx
│   │   │       ├── Dashboard.jsx
│   │   │       ├── ForgotPassword.jsx
│   │   │       ├── Home.jsx
│   │   │       ├── Login.jsx
│   │   │       ├── Marketplace.jsx
│   │   │       ├── Orders.jsx
│   │   │       ├── SellerProfile.jsx
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── contactController.js
│   │   ├── userController.js
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   ├── auth.js
│   │   ├── authMiddleware.js
│   │   ├── cloudinaryUpload.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── db.js
│   ├── modules/
│   │   ├── admin.js
│   │   ├── chatRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── productRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── chatRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── productRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
├── tests/
│   ├── test.py
│   ├── test.rest
│   
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md

## Key Features

### 🔐 **Authentication & KYC System**
- National ID integration for secure user verification
- Document upload and verification system

### 🌾 **Food Traceability**
- Complete supply chain visibility
- Real-time product location tracking

### 🏪 **Marketplace**
- Product listing and search
- Category filtering
- Direct farmer-to-consumer sales
- Price comparison and market analytics

### 📊 **Dashboard & Analytics**
- Real-time statistics
- Performance metrics
- Sales tracking
- Supply chain insights

### 🌍 **Multi-Language Support**
- English, Amharic, and other local languages
- Localized content
- Cultural adaptation

## Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing


### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDBAtlas** - Database
- **JWT** - Authentication
- **Multer** - File uploads

### DevOps
- **GitHub Actions** - CI/CD
- **netlify** - Web server

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB


### Installation

1. Clone the repository
```bash
git clone https://github.com/Tilahun-Sitotaw/agrochain-ethiopia.git
cd agrochain-ethiopia
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server
```bash
npm run dev
```

5. Start the backend server
```bash
cd backend
npm install
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This prils.oject is licensed under the MIT License - see the LICENSE file for deta

## Support

For support, please contact:
- Email: tilahunsitotaw87@gmail.com
- Website: https://agrochain-ethiopia.com
- Frontend: [https://agrochain-ethiopia-2025.netlify.app/](https://agrochain-ethiopia-2025.netlify.app/)
- Admin Page: [https://agrochain-ethiopia-admin-page12.netlify.app/](https://agrochain-ethiopia-admin-page12.netlify.app/)
- Documentation: https://docs.agrochain-ethiopia.com

## Acknowledgments

- Ethiopian National ID System
- Open source contributors
- Ethiopian agricultural sector stakeholders

