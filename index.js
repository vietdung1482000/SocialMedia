
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRouter.js'
import PostRoute from './Routes/PostRoute.js'
import UploadRoute from './Routes/UploadRoute.js'

// Routes
const app = express()

app.use(express.static('public')); 
app.use('/images', express.static('images'));

// middleware
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())

dotenv.config()

mongoose.
    connect(process.env.MONGO_URL,
        { useNewUrlParser: true, useUnifiedtopology: true })
    .then(() => app.listen(process.env.PORT, () => console.log(`listening at ${process.env.PORT}`)))
    .catch((error) => console.log(error))


app.use('/auth', AuthRoute)
app.use('/user', UserRoute)
app.use('/post', PostRoute)
app.use('/upload', UploadRoute)
