const express = require('express')
const Router = express.Router();
const user = require('../controller/userController');
const auth=require('../middleware/auth')



Router.post("/signup",user.userRegister);

Router.post('/login',user.userLogin)

Router.put('/update/:id',auth.JWTValidation,user.userUpdate)

Router.delete('/delete/:id',auth.JWTValidation,user.userDelete)



module.exports=Router;