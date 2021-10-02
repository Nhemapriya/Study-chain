// https://kovan.etherscan.io/address/0xa606e7a8ef0b99f081f674d0dff2ce90c46cc328

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const requireLogin = require('../middleware/requireLogin')
const Web3 = require('web3')
const Tx = require('ethereumjs-tx').Transaction
const { rpcURL,account,abi,contractAddress,private_key, } = require("../keys")

const web3 = new Web3(rpcURL)
const contract = new web3.eth.Contract(abi, contractAddress)



router.get("/chain", (req, res) =>{
    res.send("hey there!")
})


router.post("/adduser",requireLogin,(req,res)=>{

    if(!req.body.name){
        return res.status(422).json({error: "Please enter all fields"})
    }
    if(!req.body.location){
        return res.status(422).json({error: "Please fill location fields"})
    }
    
    web3.eth.getTransactionCount(account, (err, txCount) => {
        console.log(txCount)
        const txObject = {
            //nonce:    web3.utils.toHex(txCount),
            gasLimit: web3.utils.toHex(800000),
            gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
            to: contractAddress,
            data: contract.methods.addUser(req.body.id, req.body.name,req.body.location,req.body.status,1000).encodeABI(),
        }
    
    
    web3.eth
    .accounts
    .signTransaction(txObject, private_key)
    .then(function(value){
    
      web3.eth
        .sendSignedTransaction(value.rawTransaction)
        .then(function(response){
            contract.getPastEvents(
                'UserAdded',
                {
                  fromBlock: 22335088,
                  toBlock: 'latest'
                },
                (err, events) => { return res.json({message: "User : "+req.body.id +" Added successfully", id : req.body.id}) }
              )
          //console.log("response:" + JSON.stringify(response, null, ' '));
        })
      })
      .catch(()=>{
        return res.status(422).json({error: "Unable to add to blockchain"})

    })
    })
})


router.post("/checkrating",requireLogin,(req,res)=>{
    console.log(req.body.id);   
    if(req.body.id){
        contract.methods.checkRating(req.body.id).call((err, result)=>{ return res.json({message: result}) })
    }
    else{
      return res.status(422).json({error: "Please enter correct user id"})
    }
})


router.post("/updaterating",requireLogin,(req,res)=>{
    if(!req.body.id){
        return res.status(422).json({error: "Please enter id field"})
    }
    if(!req.body.rating){
        return res.status(422).json({error: "Please fill rating field"})
    }

    web3.eth.getTransactionCount(account, (err, txCount) => {
        const txObject = {
        //nonce:    web3.utils.toHex(txCount),
        gasLimit: web3.utils.toHex(800000),
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'gwei')),
        to: contractAddress,
        data: contract.methods.updateRating(req.user.id,Number(req.body.rating)).encodeABI(),
    }


    web3.eth
    .accounts
    .signTransaction(txObject, private_key)
    .then(function(value){

    web3.eth
    .sendSignedTransaction(value.rawTransaction)
    .then(function(response){
        return res.json({message: "Rating updated for User ID: "+req.body.id })
    })
    .catch((err)=>{
        return res.status(422).json({error: "Unable to update rating to blockchain"})
    })
  })
})

})

module.exports = router