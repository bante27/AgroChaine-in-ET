# AgroChain Ethiopia - National ID-Integrated Food Traceability Platform

## Project Overview
AgroChain Ethiopia is a comprehensive food traceability platform that integrates with Ethiopia's National ID system to create transparency, trust, and efficiency in the food supply chain. The platform connects farmers, distributors, retailers, and consumers through  technology.

## Project Structure

```
AgroChain-Ethiopia/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   ├── videos/
│   │   └── icons/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navigation.jsx
│   │   │   └── Layout.jsx
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── Alert.jsx
│   │   ├── forms/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── KYCForm.jsx
│   │   │   └── ContactForm.jsx
│   │   ├── dashboard/
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   ├── RecentActivity.jsx
│   │   │   └── QuickActions.jsx
│   │   ├── marketplace/
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── SearchFilter.jsx
│   │   │   └── CategoryFilter.jsx
│   │   ├── farmer/
│   │   │   ├── FarmerProfile.jsx
│   │   │   ├── ProductManagement.jsx
│   │   │   └── SalesTracking.jsx
│   │   ├── traceability/
│   │   │   ├── TraceabilityChart.jsx
│   │   │   ├── QRCodeGenerator.jsx
│   │   │   └── ProductHistory.jsx
│   │   └── kyc/
│   │       ├── DocumentUpload.jsx
│   │       ├── NationalIDVerification.jsx
│   │       └── VerificationStatus.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Services.jsx
│   │   ├── Contact.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Marketplace.jsx
│   │   ├── FarmerPortal.jsx
│   │   ├── DistributorPortal.jsx
│   │   ├── RetailerPortal.jsx
│   │   └── ConsumerPortal.jsx
│   ├── services/
│   │   ├── api/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── products.js
│   │   │   ├── traceability.js
│   │   │   └── kyc.js
│   │   ├
│   │   ├── nationalId/
│   │   │   ├── verification.js
│   │   │   └── validation.js
│   │   └── utils/
│   │       ├── storage.js
│   │       ├── encryption.js
│   │       └── validation.js
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   ├── UserContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── LanguageContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useLocalStorage.js
│   │   ├── useApi.js
│   │   └── useNotification.js
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── formatters.js
│   │   └── validators.js
│   ├── styles/
│   │   ├── globals.css
│   │   ├── components.css
│   │   └── utilities.css
│   ├── assets/
│   │   ├── images/
│   │   ├── videos/
│   │   ├── icons/
│   │   └── fonts/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── productController.js
│   │   │   ├── traceabilityController.js
│   │   │   └── kycController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── TraceabilityRecord.js
│   │   │   ├── KYCVerification.js
│   │   │   └── Transaction.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── products.js
│   │   │   ├── traceability.js
│   │   │   └── kyc.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   ├── rateLimiter.js
│   │   │   └── errorHandler.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── productService.js
│   │   │   ├── traceabilityService.js
│   │   │   ├── kycService.js
│   │   │   └── blockchainService.js
│   │   ├── utils/
│   │   │   ├── database.js
│   │   │   ├── encryption.js
│   │   │   ├── validation.js
│   │   │   └── helpers.js
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── blockchain.js
│   │   │   ├── nationalId.js
│   │   │   └── environment.js
│   │   └── app.js
│   ├── package.json
│   └── server.js
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── USER_MANUAL.md
│   └── TECHNICAL_SPECIFICATIONS.md
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .gitignore
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Key Features

### 🔐 **Authentication & KYC System**
- National ID integration for secure user verification
- Document upload and verification system
- Multi-role authentication (Farmer, Distributor, Retailer, Consumer)

### 🌾 **Food Traceability**

- QR code generation and scanning
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
- English and Amharic support
oromogna  tgregna , and like include the local language?

- Localized content
- Cultural adaptation

## Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Zustand** - State management

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File uploads



### DevOps
- **Docker** - Containerization
- **GitHub Actions** - CI/CD
- **Nginx** - Web server

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Docker (optional)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/agrochain-ethiopia.git
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

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact:
- Email: support@agrochain-ethiopia.com
- Website: https://agrochain-ethiopia.com
- Documentation: https://docs.agrochain-ethiopia.com

## Acknowledgments

- Ethiopian National ID System

- Open source contributors
- Ethiopian agricultural sector stakeholders