import express, {Response , Request} from 'express'
import {botRouter} from './routes/bot'
import cors from 'cors'
import dotenv from 'dotenv'
const app = express()
dotenv.config()
const port = 5000
app.use(express.json())
app.use(cors())
app.use('/', botRouter)
app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
})