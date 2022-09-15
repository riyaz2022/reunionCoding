import mongoose from "mongoose"


const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required: true
    },
    like: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    unlike: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    creator:{type: String, ref: 'User', required: true},

    comment: [{
        type:String
    }]

} , {timestamps:true})

var Post = mongoose.model("Post", postSchema)
export default Post