const  TweetController=require("../Controller/Tweet")
const  router =require("express").Router()
const isAuth=require("../authentication/Auth")

//the routes of tweets modals
router.post("/Create/tweet",isAuth,TweetController.Createtweet)
router.get("/Like/tweet/:tweetId",isAuth,TweetController.liketweet)
router.get("/DisLike/tweet/:tweetId",isAuth,TweetController.Disliketweet)
router.post("/Reply/tweet/:tweetId",isAuth,TweetController.Replytweet)
router.get("/tweet/:tweetId",isAuth,TweetController.gettweetDetail)
router.get("/tweet",TweetController.getAlltweetDetail)
router.delete("/Delete/tweet/:tweetId",isAuth,TweetController.deleteTweet)
router.get("/Retweet/:tweetId",isAuth,TweetController.retweet)

module.exports  = router
