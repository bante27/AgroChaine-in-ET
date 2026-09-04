/**
 * Agrochain Backend Architecture & Scaffolding Guide
 * Senior Backend Architect & Node.js/Express Expert Design
 */

/*
================================================================================
AGROCHAIN BACKEND FILE TREE STRUCTURE (`server/src/`)
================================================================================

server/
├── .env
├── package.json
└── src/
    ├── app.js                          # Express application setup, security, and middleware stack
    ├── server.js                       # Server entry point (HTTP server initialization, DB connection, process error handling)
    ├── config/
    │   ├── db.js                       # MongoDB / Mongoose connection configuration
    │   ├── blockchain.js               # Web3 / Smart Contract / Hyperledger Fabric configuration & provider setup
    │   └── env.js                      # Centralized environment variable validation and export
    ├── models/
    │   ├── User.js                     # Mongoose schema for Users (Farmers, Distributors, Buyers, Admins)
    │   ├── Crop.js                     # Mongoose schema for Crop batches, origin, yield, and metadata
    │   ├── SupplyChain.js              # Mongoose schema for end-to-end supply chain checkpoints and custody logs
    │   └── Transaction.js              # Mongoose schema and blockchain transaction hash logging
    ├── services/
    │   ├── userService.js              # Business logic for user authentication, profiles, and role management
    │   ├── cropService.js              # Business logic for crop registration, inspection, and inventory
    │   ├── supplyChainService.js       # Business logic for tracking custody, transit stages, and IoT telemetry
    │   └── blockchainService.js        # Interaction layer with smart contracts and immutable ledger logging
    ├── controllers/
    │   ├── authController.js           # HTTP request handlers for authentication (register, login, token refresh)
    │   ├── userController.js           # HTTP request handlers for user profile operations
    │   ├── cropController.js           # HTTP request handlers for crop management endpoints
    │   ├── supplyChainController.js    # HTTP request handlers for tracking and milestone verification
    │   └── transactionController.js    # HTTP request handlers for financial and blockchain transaction history
    ├── routes/
    │   ├── index.js                    # Main router aggregator mounting all sub-routes under /api/v1
    │   ├── authRoutes.js               # Authentication endpoints (/api/v1/auth)
    │   ├── userRoutes.js               # User management endpoints (/api/v1/users)
    │   ├── cropRoutes.js               # Crop catalog endpoints (/api/v1/crops)
    │   ├── supplyChainRoutes.js        # Supply chain tracking endpoints (/api/v1/supply-chain)
    │   └── transactionRoutes.js        # Transaction & blockchain log endpoints (/api/v1/transactions)
    ├── middlewares/
    │   ├── auth.js                     # JWT authentication middleware ensuring valid user session
    │   ├── roleCheck.js                # Role-Based Access Control (RBAC) middleware for Farmers/Distributors/Buyers
    │   ├── validate.js                 # Joi / Zod validation schema enforcement middleware
    │   └── errorHandler.js             # Global Error Handling middleware capturing operational and programming errors
    ├── validation/
    │   ├── userValidation.js           # Validation schemas for user registration and login
    │   ├── cropValidation.js           # Validation schemas for crop creation and updates
    │   └── supplyChainValidation.js    # Validation schemas for supply chain status transitions
    └── utils/
        ├── catchAsync.js               # Higher-order function to catch asynchronous errors in route handlers
        ├── appError.js                 # Custom error class extending standard Error for operational status codes
        └── blockchainHelpers.js        # Utility functions for hashing, signature verification, and payload formatting

================================================================================
RESPONSIBILITY & ARCHITECTURAL PATTERN EXPLANATION
================================================================================

1. `config/`:
   - Holds technical configuration files such as database connection parameters, third-party service credentials, and Web3/blockchain connection endpoints. Ensures configuration is decoupled from business execution.

2. `models/`:
   - Contains Mongoose schemas defining the data persistence layer. In Agrochain, this includes schemas for users (with role distinctions: Farmer, Distributor, Buyer, Admin), crops, supply chain tracking milestones, and immutable ledger/transaction logs.

3. `services/`:
   - The core business logic layer. Completely decoupled from HTTP transport (`req`, `res`). Services handle complex computations, database queries via models, and blockchain smart contract interactions. This ensures high testability and reusability.

4. `controllers/`:
   - The transport layer handlers. Controllers receive incoming HTTP requests, extract parameters, invoke the corresponding `services/` method wrapped in `catchAsync`, and send back standardized HTTP responses. They contain zero business logic.

5. `routes/`:
   - Maps HTTP verbs and endpoints to their respective controllers, grouping endpoints logically (e.g., Auth, Crops, SupplyChain, Transactions) behind versioned prefixes (`/api/v1`).

6. `middlewares/`:
   - Interceptors handling cross-cutting concerns like JWT authentication verification, Role-Based Access Control (RBAC) safeguarding farmer/distributor/buyer actions, request validation schemas, and the centralized Global Error Handler.

7. `validation/`:
   - Houses declarative validation schemas (using Joi or Zod) to sanitize and validate incoming payload structures before hitting controllers or services.

8. `utils/`:
   - Helper utilities including `catchAsync` to eliminate repetitive `try/catch` blocks in controllers, custom `AppError` for consistent error handling, and cryptographic/blockchain utility functions.

9. `app.js` & `server.js`:
   - `app.js` configures the Express application instance, middleware stack (helmet, cors, compression, rate-limiting), and route mounting.
   - `server.js` acts as the entry point, loading environment variables, initiating MongoDB connection, setting up Web3/blockchain providers, and starting the HTTP server with graceful shutdown handlers.
