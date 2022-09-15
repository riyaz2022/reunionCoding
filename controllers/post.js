import express from "express"
import bcrypt from "bcryptjs"
import mongoose from "mongoose"
import Post from "../models/Post"
import User from "../models/User"

//create a post
export const post = async (req,res) => {
    const post = req.body 
    const userId = req.header.id
    
    const newPost = new Post({ ...post, creator:userId, createdAt: new Date().toISOString() })
    try {
        const user = await User.findById(req.header.id)
        await newPost.save()
        await user.updateOne({$push:{postsCreated: newPost.id}})
        res.status(201).json(newPost)
    } catch (error) {
        res.status(409).json({message : error.message})
    }
}

//delete a post
export const deletePost = async (req,res) => {
    const id = req.params.id
    const userId = req.header.id

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("Invalid ID for deletion")
    const post = await Post.findById(id)
    if(userId === post.creator){
        try {
            const user = await User.findById(req.header.id)
            await user.updateOne({$pull: {postsCreated: id}})
            await Post.findByIdAndDelete(id)
            //clearing posts document from users database
            res.json({message: "Post deleted successfully"})
        } catch (error) {
            res.status(409).json({ message: error.message})
        }
    }else{
      res.status(500).json("This user cannot delete the post")
  }
}

//like a post
export const like = async (req,res) => {
    try {

        const postId = req.params.id
        const userId = req.header.id

        const post = await Post.findById(postId)
        
        if(!post.unlike.includes(userId)){ 

            if(!post.like.includes(userId)){

                await post.updateOne({ $push: {like: userId}})

                res.status(200).json("The post has been liked")
            } else {
                await post.updateOne({ $pull: {like: userId}})
                
                res.status(200).json("The post has been not liked")
            }
        } else {
            res.json("You cannot both like and unlike the same post")
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
}

//unlike a post
export const unlike = async (req,res) => {
    try {

        const postId = req.params.id
        const userId = req.header.id

        const post = await Post.findById(postId)
        
        if(!post.like.includes(userId)){ 

            if(!post.unlike.includes(userId)){

                await post.updateOne({ $push: {unlike: userId}})

                res.status(200).json("The post has been unliked")
            } else {
                await post.updateOne({ $pull: {unlike: userId}})
                
                res.status(200).json("The post has been not unliked")
            }
        } else {
            res.json("You cannot both like and unlike the same post")
        }

    } catch (error) {
        res.status(500).json(error.message)
    }
}


//add comment
export const comment = async (req,res) => {
    try {
        const post = await Post.findById(req.params.id)
        const user = await User.findById(req.header.id)
        const newComment = req.body
        if(!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send("Invalid ID to comment")

        await post.updateOne({$push: {comment:newComment}})
        res.status(201).json(newComment.id)

    } catch (error) {
        res.status(500).json(error)
    }
}

//get post by id
export const getPost = async (req,res) => {
    const id = req.params.id
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json("Invalid ID")

    try {
        const post = await Post.findById(id)
        res.status(200).json({id:post.id, likes:post.like.length, comments:post.comment.length})
    } catch (error) {
        res.status(500).json(error)
    }
}

//get all posts by authenticated user
export const getAllPosts = async (req,res) => {
    const userId = req.header.id
    try {
        const posts = await Post.find().sort({"createdAt": 1})
        res.status(200).json({id: posts.id, title: posts.title, desc: posts.description, created_at: posts.createdAt, comments: posts.comment, likes: posts.likes.length})
    } catch (error) {
        res.status(500).json(error)
    }
}

