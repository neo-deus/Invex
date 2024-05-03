
import mongoose from "mongoose"

const UserSchema=new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please provide username"]
    },
    email:{
        type:String,
        required:[true,"Please provide email"]
    },
    password:{
        type:String,
        required:[true,"Please provide password"]
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken:String,
    verifyTokenExpiry:Date,

})

const User = mongoose.models.Users || mongoose.model("Users", UserSchema);
export default User;