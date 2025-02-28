import { Account, User } from "../db.js"
import jwt from "jsonwebtoken"
import bcryptjs, { compareSync, hashSync } from "bcryptjs"
import { signupSchema, signinSchema, updateUserSchema } from "../zod-validation/userSchema.zod.js"
import { JWT_SECRET } from "../config.js"
export const createUser = async (req, res) => {
    const { userName, firstName, lastName, password } = req.body
    const { success } = signupSchema.safeParse(req.body)
    if (!success) {
        return res.status(400).json({ message: "please provide all the fields" })
    }
    const findUser = await User.findOne({
        userName: req.body.userName
    })
    if (findUser) {
        return res.json({ message: "username already taken" })
    }
    const hashedPassword = await bcryptjs.hash(password, 10)
    const user = await User.create({ userName, firstName, lastName, password: hashedPassword })
    await Account.create({
        userId: user._id,
        balance: 1 + Math.random() * 10000
    })
    const token = jwt.sign({
        userId: user._id
    }, JWT_SECRET)
    return res.status(200).json({ message: "User created successfully", token: token })
}

export const signin = async (req, res) => {
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
}

export const getUser = async (req, res) => {
    const id = req.params.id
    const user = await User.findById(id)
    if (!user) {
        return res.json({ message: "user not found" })
    }
    return res.json({ message: "User found", user })
}
export const updateUser = async (req, res) => {
    const id = req.params.id
    const safeUser = updateUserSchema.safeParse(req.body)
    if (!safeUser) {
        return res.json({ message: "please provide a field to update" })
    }
    const { userName, firstName, lastName, password } = req.body
    if (!password) {
        const user = await User.findByIdAndUpdate(id, req.body, { new: true })
        if (!user) {
            return res.json({ message: "user not found" })
        }
        return res.json({ message: "user updated" })
    }
    const hashedPassword = hashSync(password, 10)
    const user = await User.findByIdAndUpdate(id, { userName, firstName, lastName, password: hashedPassword }, { new: true })
    if (!user) {
        return res.json({ message: "user not found" })
    }
    return res.json({ message: "user updated" })
}

export const search = async (req, res) => {
    const filter = req.query.filter || ""
    const users = await User.find({
        $or: [{
            firstName: {
                "&regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
}