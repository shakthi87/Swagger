const express = require('express')
const Router=express.Router()
const feed=require('../controller/feedController')
const feed1=require('../controller/feedController1')
const auth=require('../middleware/auth')

const upload=require('../middleware/file')

Router.get('/allfeeds',feed.SelectAllfeed)

Router.get('/view',feed1.AllFeedDetails,(req,res)=>{
      console.log("heloo")
})

Router.post('/insert',auth.JWTValidation,upload.single('media_name'),feed.InsertFeed)

Router.put('/upload/:feed_id',auth.JWTValidation,feed.UpdateFeed)

Router.delete('/delete/:feed_id',auth.JWTValidation,feed.DeleteFeed)

module.exports=Router;