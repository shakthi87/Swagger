const express=require('express')
const Router=express.Router()
const likes=require('../controller/likeController')
const auth=require('../middleware/auth');

Router.get('/getAllLike',likes.AllLike);
Router.post('/insert',auth.JWTValidation,likes.InsertLike);


module.exports=Router