import express from "express"
import bcrypt from "bcryptjs"
import mongoose from "mongoose"
import User  from "../models/User.js"


export const authenticate = async (req,res) => {

    const { username, password} = req.body;
    if(!username || !password) {
        return res.json("Input error")
    }

    try {
        const existingUser = await User.findOne({ username })
        if(!existingUser) return res.status(404).json({message: "User does not exists"})

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if(!isPasswordCorrect) return res.status(400).json({ message: "Invalid Credentials"})

        const token = jwt.sign({username: existingUser.username, id:existingUser._id}, process.env.SECRET_KEY, { expiresIn: "5hr"})

        res.status(200).json({user:existingUser, token})

    } catch (error) { 
        res.status(500).json({ message:"Something went wrong"})
    }
}


//created follow and unfollow functionality in a single API 
export const followUnfollow = async (req,res) => {
    if(req.header.id !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.header.id)
            if(!user.followers.includes(req.header.id)){
                await user.updateOne({ $push: {followers: req.header.id}})
                await currentUser.updateOne({ $push: {following: req.params.id}})
                res.send("Followed the user sucessfully")
            } else {
                await user.updateOne({ $pull : {followers: req.header.id}})
                await currentUser.updateOne({$pull: {following: req.params.id}})
                res.send("Unfollowed the user successfully")
            }
        } catch (error) {
            res.status(500).json(error)
        }

    }else {
        res.status(403).json("you cannot follow/unfollow your own account")
    }
}


export const user = async (req, res) => {
    try {
        const existingUser = await User.findOne({ username })
        if(!existingUser) return res.status(404).json({message: "User does not exists"})

        res.status(200).json({username:existingUser.username,followers:existingUser.followers,following:existingUser.following})

    } catch (error) {
        res.status(500).json({ message:"Something went wrong"})
    }
}