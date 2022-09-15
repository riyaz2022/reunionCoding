import express from "express"
import { authenticate, followUnfollow, user } from "../controllers/user.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()

router.post("/authenticate", authenticate)

router.post("/follow/:id",verifyToken, followUnfollow)

//created using a single API 
//router.post("/unfollow/:id",verifyToken, unfollow)

router.get("/user",verifyToken, user)

