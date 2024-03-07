const mongoose=require("mongoose")
const Schema=mongoose.Schema
const TweetSchema=new Schema({
 Content:{
    type:String,
    required:true
 },
 TweetedBy:{
    type:mongoose.Types.ObjectId,ref:"User"
 },
 Likes:[
    {
        type:mongoose.Types.ObjectId,ref:"User"
    }
 ],
 Retweet:[
    {type:mongoose.Types.ObjectId,ref:"User"}
 ],
 Image:{
    type:String
 },
 Reply:[{
    type:mongoose.Types.ObjectId,
    ref:"Tweet"
 }]
},{
   timestamps:true
})
module.exports=mongoose.model("Tweet",TweetSchema)