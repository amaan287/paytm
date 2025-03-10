import express from "express"
import { db } from "./db.js"
import v1Routes from "./routes/index.js"
import cors from "cors"
const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/v1/", v1Routes)

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000")
})


