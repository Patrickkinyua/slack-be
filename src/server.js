import express from "express"
import dotenv from 'dotenv'
import { connectDB } from "./config/db.config.js"
import { clerkMiddleware} from '@clerk/express'

import { functions } from "./config/inngest.config.js"
import {serve} from "inngest/express"
import { Inngest } from "inngest"



dotenv.config()

const PORT =    process.env.PORT || 5001

const app = express()
app.use(clerkMiddleware())
app.use(express.json())

app.use ("/api/inngest", serve({client:Inngest ,functions}))


app.get('/', (req,res) => {
    res.send('hello world')
})

const startServer = async () => {
    try{
       await connectDB()

       if( process.env.NODE_ENV !== "PRODUCTION"){
          app.listen(PORT, ()=> console.log ("server is running on port 5001"))

       }


    }catch(error){
        console.log(error.message, "eror starting the server")
        process.exit(1);
    }
}


startServer();


export default app;





