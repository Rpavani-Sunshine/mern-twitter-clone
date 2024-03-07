const  jwt=require ("jsonwebtoken")
const  mongoose =require("mongoose")
const  User =require("../Model/User")
const JWT_Secret=process.env.JWT_Secret

//here is the Jwt authentication
module.exports=   (req,res,next)=>{
    const {authorization} =req.headers
   //  console.log(authorization)
    if(!authorization){
        return res.status(401).json({msg:"user is not logged in"})
    }
    const  token = authorization.replace("Bearer ","")
   //  console.log(token)
    jwt.verify(token,JWT_Secret,(error,payload)=>{
         if(error){
            console.log(error)
            return res.status(401).json({msg:"user is not logged in"})

         }
            const _id=payload
            User.findById(_id).then(dbuser=>{
            req.user=dbuser;
            next()
         }).catch(err=>{
            console.log(err)
         })
     
                       
    })
}