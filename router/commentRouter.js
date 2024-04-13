const express=require('express')
const Router=express.Router()
const comment=require('../controller/commentController')
const auth=require('../middleware/auth')

Router.get('/allcomments',comment.AllComments)

Router.post('/insert',auth.JWTValidation,comment.InsertComment)

Router.put('/update/:comment_id',auth.JWTValidation,comment.UpadateComment)

Router.delete('/delete/:comment_id',auth.JWTValidation,comment.DeleteComment)

module.exports=Router