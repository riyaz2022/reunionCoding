import express from "express"
import { comment, deletePost, getAllPosts, getPost, like, post, unlike } from "../controllers/post.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()

router.post("/posts",verifyToken, post)

router.delete("/posts/:id",verifyToken, deletePost)

router.post("/like/:id",verifyToken, like)

router.post("/unlike/:id",verifyToken, unlike)

router.post("/comment/:id",verifyToken, comment)

router.get("/posts/:id",verifyToken, getPost)

router.get("/all_posts",verifyToken, getAllPosts)