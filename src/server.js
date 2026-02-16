import express from "express"
import dotenv from 'dotenv'

dotenv.config()

const PORT =    process.env.PORT || 5001

const app = express()

app.get('/', (req,res) => {
    res.send('hello world')
})



app.listen(PORT, ()=> console.log ("server is running on port 5001"))