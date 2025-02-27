import express from "express"
import { getUser, createUser, updateUser, signin } from "../controllers/user.controller.js"
const router = express.Router()
router.post("/signup", createUser)
router.post("/signin", signin)
router.get("/get/:id", getUser)
router.put("/update/:id", updateUser)

export default router