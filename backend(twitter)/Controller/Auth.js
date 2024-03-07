const User=require("../Model/User")
const bcrypt=require("bcrypt")
const jwt =require("jsonwebtoken")
const  Tweet =require("../Model/Tweet")
const JWT_Secret=process.env.JWT_Secret
/* The code snippet is defining a function named `Register` that is exported as a module. This function
is an asynchronous function that handles the registration process for a user. */
exports.Register=async(req,res,next)=>{
    try {
        const { Name, UserName,Email, Password } = req.body
        if (!Name || !UserName || !Email || !Password) {
            return res.status(400).send({ msg: "One or more field is empty" })
        }
        const HashedPassword = await bcrypt.hash(Password, 16)
        const user = new User({
            Name: Name,
            UserName:UserName,
            Email: Email,
            Password: HashedPassword,
           
        })
        const UserInDB = await User.findOne({ Email: Email })
        if (UserInDB) {
            return res.status(409).send({msg:"Email is already used "})
        }
        const data = await user.save()  
        res.status(200).json({ msg: "user sign up succesfully", data })
    }
    catch (err) {
        console.log(err)
    }
}

/* The code snippet defines an asynchronous function named `Login` that handles the login process for a
user. */

exports.Login=async(req,res,next)=>{
    try {
        const { Email, Password } = req.body
        if (!Email || !Password) {
            return res.status(404).json({ msg: "ONE OR MANDOTARY FIELD IS EMPTY" })
        }
        const user = await User.findOne({ Email: Email })
        if (!user) {
            return res.status(404).json({ msg: "Email not found" })
        }
        const matchedPassword = await bcrypt.compare(Password, user.Password)
        if (!matchedPassword) {
            return res.status(400).json({msg:"Password is incorrect"})
        }
        const jwttoken = jwt.sign({ _id: user._id },JWT_Secret)
        const userInfo = ({ "Email": user.Email, "Name": user.Name, "_id": user._id ,"UserName":user.UserName,"ProfilePic": user.ProfilePic})

        res.status(200).json({ token: jwttoken, user: userInfo, msg: "USER logged in successfully" })
    }
    catch (Err) {
        console.log(Err)
    }
}

/* The code snippet is defining an asynchronous function named `getUser` that handles the retrieval of
a user's data based on their ID. */
/* The `exports.getUser` function is responsible for retrieving a user's data and their tweets based on
their ID. */
exports.getUser=async(req,res,next)=>{
    try{
     const {UserId}=req.params
   //  console.log(UserId)
     const user=await User.findById(UserId)

     
     if(!user){
        return res.status(404).json({msg:"No User found"})
     }   
     const UserTweet=await Tweet.find({TweetedBy:UserId})
     if(!UserTweet){
        return res.status(404).json({msg:"No tweets Found"})
     }
     return res.status(200).json({user,UserTweet})
   
    }catch(err){
        console.log(err)
    }
}
/* The `followUser` function is responsible for allowing a user to follow another user. It takes in the
`req`, `res`, and `next` parameters, which are used to handle the HTTP request and response. */
exports.followUser=async(req,res,next)=>{
    try{
     const {UserId}=req.params
     const user=await User.findOne({_id:UserId})
    // console.log(user)
     if(!user){
        return res.status(404).json({msg:"NO User found"})
     }
    if( user.Followers.find(p=>p._id.toString()===req.user._id.toString())){
        return res.status(502).json({msg:"User has already a follower "})   
    }
   
     user.Followers.push(req.user)
     req.user.Following.push(UserId)
     await user.save()
     await req.user.save()
     return res.status(200).json({msg:`you followed ${user.Name}`})

    }catch(err){
        console.log(err)
    }
}
/* The `UnfollowUser` function is responsible for unfollowing a user. It takes in the `req`, `res`, and
`next` parameters, which are used to handle the HTTP request and response. */
exports.UnfollowUser=async(req,res,next)=>{
    try{
     const {UserId}=req.params
     const user=await User.findOne({_id:UserId})
    // console.log(user)
     if(!user){
        return res.status(404).json({msg:"NO User found"})
     }
    if( user.Followers.find(p=>p._id.toString() ===req.user._id.toString())){
     user.Followers.pull(req.user)
     req.user.Following.pull(UserId)
     await user.save()
     await req.user.save()
     return res.status(200).json({msg:`you Unfollowed ${user.Name}`})
    }
    
     return res.status(502).json({msg:"User doesn't follow "})   
    }catch(err){
        console.log(err)
    }
}
exports.EditUser=async(req,res,next)=>{
   try{
    const {Name,DOB,Location}=req.body
    const user=await User.findByIdAndUpdate(req.user,{
      Name:Name,
      DOB:DOB,
      Location:Location

    },{
        new:true
    })
    if(!user){
        return res.status(404).json({msg:"NO user Found"})
    }
    return res.status(201).json({msg:"User has been Upadated",user})

   }
   catch(err){
    console.log(err)
   }


}
/* The `getUsertweet` function is retrieving all the tweets posted by a specific user. It first finds
the user based on the `req.user` parameter, which represents the user ID. If the user is found, it
returns a JSON response with the tweets. If the user is not found, it returns a JSON response with a
"no user found" message and a status code of 404. */
exports.getUsertweet=async(req,res,next)=>{
  try{
    const  tweets =await User.findById(req.user)
    if(!tweets){
        return res.status(404).json({msg:"no user found"})
    }
    return res.status(200).json({tweets})
  }
  catch(err){
    console.log(err)
  }
}

/* The `updateProfilepic` function is responsible for updating the profile picture of a user. It takes
in the `req`, `res`, and `next` parameters, which are used to handle the HTTP request and response. */
exports.updateProfilepic=async(req,res,next)=>{
    try{
        
      const  {ProfilePic}=req.body
      const  tweets =await User.findByIdAndUpdate(req.user,{
         ProfilePic:ProfilePic
      },{new:true})
      if(!tweets){
          return res.status(404).json({msg:"no user found"})
      }
      return res.status(200).json({msg:"profilepicture updated",tweets})
    }
    catch(err){
      console.log(err)
    }
  }
