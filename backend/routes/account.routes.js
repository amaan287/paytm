import express from "express"
import { balance, transfer } from "../controllers/account.controller.js"
const router = express.Router()
router.get("/balance", balance)
router.post("/transfer", transfer)

export default router