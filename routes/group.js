const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Group = mongoose.model("Group")

router.post('/creategroup',requireLogin, (req,res)=>{
    const {name, description, domain,motivation,reasoning, states,country, pic} = req.body
    console.log(req.body)
    console.log(name, description, domain,motivation,reasoning, states,country ,pic)
    if(!name || !description || !domain)
    {
        return res.status(422).json({error: "Group cant be created"})
    }
    req.user.password = undefined
    const group = new Group({
        name: name,
        description :description,
        domain : domain,
        motivation : motivation,
        reasoning : reasoning,
        states : states,
        country : country,
        photo:pic,
        status: "unaccredited",
        curator:req.user._id
    })
    group.save()
    .then(result =>{
        res.json({group:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/allgroup', requireLogin, (req,res)=>{
    Group.find()
    //based on timestamp
    .sort('-createdAt')
    .then(groups=>{
        res.json({groups:groups})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/accredited', requireLogin, (req,res)=>{
    Group.find({ status : "accredited"})
    //based on timestamp
    .sort('-createdAt')
    .then(groups=>{
        res.json({groups:groups})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/unaccredited', requireLogin, (req,res)=>{
    Group.find({ status : "unaccredited"})
    //based on timestamp
    .sort('-createdAt')
    .then(groups=>{
        res.json({groups:groups})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/accredit',requireLogin, (req,res)=>{
    Group.findByIdAndUpdate(req.query.id,{
        $set:{
            status: "accredited"
        }
    },{new:true}, (err, result)=>{
        if(err)
        {
            return res.status(422).json({error:"status cant be updated"})
        }
        res.json(result)
    })

})

router.get('/unaccredit',requireLogin, (req,res)=>{
    Group.findByIdAndUpdate(req.query.id,{
        $set:{
            status: "unaccredited"
        }
    },{new:true}, (err, result)=>{
        if(err)
        {
            return res.status(422).json({error:"status cant be updated"})
        }
        res.json(result)
    })

})


//Curator
router.get('/mygroup', requireLogin, (req,res)=>{
    Group.find({curator:req.user._id})
    //.populate("postedBy","_id name")
    .then(groups=>{
        res.json({mygroups:groups})
    })
    .catch(err=>{
        console.log(err)
    })
})


router.put('/join',requireLogin, (req,res)=>{

    
    Group.findByIdAndUpdate(req.body.groupId,{
        $addToSet:{pending:req.user._id}
    },{
        new:true
        //updated record
    }).exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        else
        {
            res.json(result)
        }
    })
})


router.put('/leave',requireLogin, (req,res)=>{
    Group.findByIdAndUpdate(req.body.groupId,{
        $pull:{pending:req.user._id}
    },{
        new:true
        //updated record
    }).exec((err,result)=>{
        if(err){
            console.log(err)
            return res.status(422).json({error:err})
        }
        else
        {
            console.log(result)
            res.json(result)
        }
    })
})


router.get('/group', requireLogin, (req,res)=>{
    Group.find({ _id:req.query.id})
    .then(groupdatum=>{
        res.json({group:groupdatum})
    })
    .catch(err=>{
        console.log(err)
    })
})


// router.put('/comment',requireLogin, (req,res)=>{
//     const comment ={
//         text:req.body.text,
//         postedBy: req.user
//     }

//     Post.findByIdAndUpdate(req.body.postId,{
//         $push:{comments:comment}
//     },{
//         new:true
//         //updated record
//     })
//     .populate("comments.postedBy","_id name")
//     .populate("postedBy","_id name")
//     .exec((err,result)=>{
//         if(err){
//             return res.status(422).json({error:err})
//         }
//         else
//         {
//             res.json(result)
//         }
//     })
// })

// //router.delete('/deletepost:postId',requireLogin, (req,res)=>{
//     //Post.findOne({_id:req.params.postId})
//     //.populate("postedBy","_id")
//     //populate("postedBy","id")
//     //.exec((err,post)=>{
//       //  if(err || !post)
//        // {
//           //  res.status(422).json({error:err})
//       //  }
//        // if(post.postedBy._id.toString() === req.user._id.toString())
//        // {
//          //   post.remove()
//          //   .then(result=>{
//           //      res.json(result)
//          //   }).catch(err=>{
//           //      console.log(err)
//     //   })
//      ///   }
//     //})
// //})

// router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
//     Post.findOne({_id:req.params.postId})
//     .populate("postedBy","_id")
//     .exec((err,post)=>{
//         if(err || !post){
//             return res.status(422).json({error:err})
//         }
//         if(post.postedBy._id.toString() === req.user._id.toString()){
//               post.remove()
//               .then(result=>{
//                   res.json(result)
//               }).catch(err=>{
//                   console.log(err)
//               })
//         }
//     })
// })


// router.get('/followedposts', requireLogin, (req,res)=>{
//     Post.find({postedBy:{$in:req.user.following}})
//     .populate("postedBy","_id name")
//     .populate("comments.postedBy","_id name")
//     .sort('-createdAt')
//     .then(posts=>{
//         res.json({posts:posts})
//     })
//     .catch(err=>{
//         console.log(err)
//     })
// })

module.exports = router