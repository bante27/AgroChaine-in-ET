import express from "express";
import auth from "../middleware/auth.js";
import isNotRestricted from "../middleware/isNotRestricted.js";
import { productImageUpload } from "../middleware/upload.js";
import { restrictUnverifiedUsers } from "../middleware/userMiddleware.js";
import * as prodCtrl from "../controllers/productController.js";

const router = express.Router();

// ==========================================
// 1. PUBLIC ROUTES (Static Paths First)
// ==========================================
router.get("/", prodCtrl.getAllProducts);

// ==========================================
// 2. AUTH PROTECTED ROUTES (Static Paths First)
// ==========================================
router.use(auth);

router.get("/my-products", prodCtrl.getMyProducts);
router.get("/sold", prodCtrl.getMySoldProducts); // 🔥 FIXED: Moved safely above /:id

router.post("/", 
  productImageUpload.array("images", 5), 
  prodCtrl.addProduct
);

// ==========================================
// 3. DYNAMIC PARAMETER ROUTES (Must Be At The Very Bottom)
// ==========================================
router.get("/:id", prodCtrl.getSingleProduct); // 🛡️ Safely catches true MongoDB IDs now

router.post("/:productId/review", isNotRestricted, prodCtrl.addReview);
router.post("/:productId/like", isNotRestricted, prodCtrl.likeProduct);
router.post("/:productId/unlike", isNotRestricted, prodCtrl.unlikeProduct);
router.post("/:productId/purchase", isNotRestricted, prodCtrl.purchaseProduct);

export default router;