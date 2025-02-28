import express from "express"
import { balance, transfer } from "../controllers/account.controller.js"
const router = express.Router()
router.post("/balance", balance)
router.get("transfer", transfer)

export default router