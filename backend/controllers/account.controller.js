import mongoose from 'mongoose'
import { Account } from '../db.js'
export const balance = async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    })
    res.json({ balance: account.balance })
}

export const transfer = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {

        const { amount, to } = req.body
        const account = await Account.findOne({ userId: req.userId }).session(session)
        if (!account || account.balance < amount) {
            await session.abortTransaction()
            return res.status(400).json({ message: "Insufficint balance" })
        }

        const toAccount = await Account.findOne({ userId: to }).session(session)
        if (!toAccount) {
            await session.abortTransaction()
            return res.status(400).json({ message: "Invalid reciever account" })
        }
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session)
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session)


        await session.commitTransaction()
        res.json({ message: `Transfer successfull of amount: ${amount}` })
    }
    catch (e) {
        res.json({ message: "somthing went wrong ", error: e })
        session.abortTransaction();
    }
}

