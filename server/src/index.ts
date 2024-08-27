import express, { Request, Response } from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes'
import submissionRoutes from './routes/submissionRoutes'
import reviewRoutes from './routes/reviewRoutes'
import listEndpoints from 'express-list-endpoints'

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.SERVER_PORT || '3000'
const api_prefix = '/api'

app.use(api_prefix, userRoutes)
app.use(api_prefix, submissionRoutes)
app.use(api_prefix, reviewRoutes)

const endpoints = listEndpoints(app)
console.log(endpoints)

app.listen(PORT, () => {
    console.log('Server Listening on PORT:', PORT)
})
