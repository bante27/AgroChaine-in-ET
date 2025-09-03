import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

// Load the YAML file
const swaggerDocument = YAML.load(path.resolve("./swagger.yaml"));

const app = express();

// Middleware for Swagger docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Example: your existing routes (import and use your routers here)
// import userRoutes from "./routes/users.js";
// import productRoutes from "./routes/products.js";
// app.use("/api/users", userRoutes);
// app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}, Swagger at http://157.245.187.246:${PORT}/docs`));
