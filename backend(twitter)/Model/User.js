const mongoose = require("mongoose")
const Schema = mongoose.Schema
//const pic = require("../Images/removed.png")
const UserSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    UserName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    ProfilePic: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAVMb6E0O8bLYdB3Ipnyato1LC63cLprsxxA&usqp=CAU"
    },
    Location: {
        type: String,

    },
    DOB: {
        type: Date
    },
    Followers: [
        { type: mongoose.Types.ObjectId, ref: "User" }
    ],
    Following: [
        {
            type: mongoose.Types.ObjectId, ref: "User"
        }
    ],
    Tweets:[
        {
            type:mongoose.Types.ObjectId,ref:"Tweet"
        }
    ]
},{
    timestamps:true
})
module.exports =mongoose.model("User",UserSchema)