import express from "express";
import auth from "../middleware/auth.js";
import isNotRestricted from "../middleware/isNotRestricted.js";
import { restrictUnverifiedUsers } from "../middleware/userMiddleware.js";
import * as transCtrl from "../controllers/transactionController.js";

const router = express.Router();

// Apply common middleware to all routes below
router.use(auth);

router.post("/buy", restrictUnverifiedUsers, isNotRestricted, transCtrl.buyProduct);
router.post("/mark-shipped/:transactionId", restrictUnverifiedUsers, isNotRestricted, transCtrl.markShipped);
router.post("/confirm-delivery/:transactionId", restrictUnverifiedUsers, isNotRestricted, transCtrl.confirmDelivery);

router.get("/my", transCtrl.getMyTransactions);
router.get("/:transactionId", transCtrl.getTransactionDetail);
export default router;