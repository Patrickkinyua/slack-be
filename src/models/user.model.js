import mongoose from "mongoose"


const userShema = new mongoose.Schema({
    email:{
        type:String,
        required:true
        
    },
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    clerkId :{
        required :true,
        unique:true,
        type:String,

    }

},{timestamps:true})




export const User = mongoose.model('User', userShema)