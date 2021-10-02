const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types


const groupSchema = new mongoose.Schema({
    name :{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    domain:{
        type: String,
        required: true
    },
    photo:{
        type: String
    },
    status:{
        type: String
    },
    motivation:{
        type: String
    },
    reasoning:{
        type: String
    },
    states:{
        type: String
    },
    country:{
        type: String
    },
    members:[
        {
            type:ObjectId,
            ref:"User"
        }
    ],
    pending:[
        {
            type:ObjectId,
            ref:"User"
        }
    ],
    curator:{
        type: ObjectId,
        ref: "User"
    }
}, {timestamps:true})

mongoose.model("Group", groupSchema)