import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    followers:[{ type: mongoose.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    postsCreated:{
        type:Array,
        default:[]
    }
}, {timestamps: true})

var User = mongoose.model("User", userSchema)
export default User