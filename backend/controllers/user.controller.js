import User from "../db.js"
import jwt from "jsonwebtoken"
import bcryptjs, { compareSync, hashSync } from "bcryptjs"
import { signupSchema, signinSchema } from "../zod-validation/userSchema.zod.js"
import { JWT_SECRET } from "../config.js"
export const createUser = (async (req, res) => {
    const { userName, firstName, lastName, password } = req.body
    const { success } = signupSchema.safeParse(req.body)
    if (!success) {
        return res.status(400).json({ message: "please provide all the fields" })
    }
    const findUser = User.findOne({
        userName
    })
    if (findUser._id) {
        return res.json({ message: "username already taken" })
    }
    const hashedPassword = await hashSync(password, 10)
    const user = await User.create({ userName, firstName, lastName, password: hashedPassword })
    const token = jwt.sign({
        userId: user._id
    }, JWT_SECRET)
    return res.status(200).json({ message: "User created successfully", token: token })
})

export const signin = (async (req, res) => {
    const { userName, password } = req.body
    const { success } = signinSchema.safeParse(req.body)
    if (!success) {
        return res.json({ message: "Please provide all fields" })
    }
    const user = await User.findOne({ userName })
    if (!user) {
        return res.json({ message: "user not found" })
    }
    const comparePassword = await compareSync(password, user.password, 10)
    if (!comparePassword) {
        return res.json({ message: "password is incorrect" })
    }
    const token = jwt.sign({
        userId: user._id
    }, JWT_SECRET)
    return res.json({ message: "User signed in successfully", token: token })
})

export const getUser = ((req, res) => {
})
export const updateUser = ((req, res) => { })