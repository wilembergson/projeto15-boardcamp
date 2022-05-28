import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import categoriesRouter from "./routes/categoriesRouter.js"
import gamesRouter from "./routes/gamesRouter.js"

const app = express()
app.use(express.json())
app.use(cors())
dotenv.config()

app.use(categoriesRouter)
app.use(gamesRouter)

app.listen(process.env.PORT, ()=> console.log('Running on', process.env.PORT))