import mongoose from "mongoose";



export const db = mongoose.connect("mongodb://localhost:27017/paytm").then(() => {
    console.log("database connected")
})


const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        minLength: 3,
        trim: true,
        lowercase: true,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        minLength: 3,
        maxLength: 20,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 20,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    }
}, {
    timestamps: true
})

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const User = mongoose.model("User", userSchema)
const Account = mongoose.model("Account", accountSchema)
export { User, Account }