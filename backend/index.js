import express from "express"
import 'dotenv/config'
import authroutes from "./routes/auth.router.js"
import reporoutes from "./routes/repo.router.js"
import {connectDB} from "./db/connectDB.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
const port = process.env.PORT || 4000;

// middlewares
app.use(cors({ 
    origin: process.env.CLIENT_URL, // Allow requests from this origin
    methods: [
        'GET',
        'POST',
        'PUT',
    ],
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
    res.send("Hello world!")
})

// Route for authorization
app.use("/api/auth", authroutes)

// Route for repository
app.use("/api/repo", reporoutes)

app.listen(port, () => {
    connectDB();
    console.log("Server listening on PORT: ", port)
})