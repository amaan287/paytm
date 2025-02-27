import express from "express"
import { getUser, createUser, updateUser } from "../controllers/user.controller.js"
const router = express.Router()
router.post("create/", createUser)
router.get("get/:id", getUser)
router.put("update/:id", updateUser)

export default router