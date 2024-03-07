const  router=require("express").Router()
const AuthController=require("../Controller/Auth")
const IsAuth=require("../authentication/Auth")

/* This code is defining the routes for various authentication-related functionalities in a Node.js
Express application. */
router.post("/auth/register",AuthController.Register)
router.post("/auth/login",AuthController.Login)
router.get("/auth/User/:UserId",AuthController.getUser)
router.get("/follow/User/:UserId",IsAuth,AuthController.followUser)
router.get("/Unfollow/User/:UserId",IsAuth,AuthController.UnfollowUser)
router.put("/Edit/User",IsAuth,AuthController.EditUser)
router.get("/tweets/User",IsAuth,AuthController.getUsertweet)
router.put("/User/uploadPP",IsAuth,AuthController.updateProfilepic)


module.exports =router