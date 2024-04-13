const async = require('async')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = require('../mysql/db_connect')
require('dotenv').config()
const Insert = require('../mysql/insert')
const Selete = require('../mysql/select')
const Update = require('../mysql/update')
const Delete = require('../mysql/delet')

const  {emailValidation,passwordValidation,nameValidation,phoneValidation,dofValidation, dataMsg}= require('../dataMsg')
const SelectUser = require('../mysql/select')

exports.userRegister = (req, res) => {
    const { email, password, name, phone_no, DOB } = req.body;
    async.waterfall([
        function validation(callback) {
            if ( !email||!password || !name || !phone_no || !DOB) {
                return callback(dataMsg.required_common)
            }
            if(!emailValidation(email)){
                return callback(dataMsg.required_emailMsg)
            }
            if(!passwordValidation(password)){
                return callback(dataMsg.required_passwordMsg)
            }
            if(!nameValidation(name)){
                return callback(dataMsg.required_nameMsg)
            }
            if(!phoneValidation(phone_no)){
                return callback(dataMsg.required_phone_noMsg)
            }
            if(!dofValidation(DOB)){
                return callback(dataMsg.required_dofMsg)
            }
            callback(null, email, password, name, phone_no, DOB)
        },
        function CheckExistingUser(email,password,name,phone_no,DOB,callback){
            Selete.SelectUser(email,(error,userExist)=>{
                if (error){
                    callback(error,null)
                }if(userExist){
                     callback('user exiting ')
                }
                else{
                    return callback(null,email,password,name,phone_no,DOB)
                }
            })
        },
        function hashPassword(email, password, name, phone_no, DOB, callback) {
            const hashP = bcrypt.hash(password, 9, (error, hashP) => {
                if (error) {
                    callback("password not hash")
                }else{
                    return callback(null, email, hashP, name, phone_no, DOB)
                } 
            })
        },
        function getvalues(email, hashP, name, phone_no, DOB, callback) {
             Insert.CreateUser(email, hashP, name, phone_no, DOB,(error,result)=>{
                if(error){
                    callback(error,null)
                }else{
                    return callback(null,result)
                }
            })
        }
    ], function (error,result) {
        if (error) {
            res.json({ status: 0, error: error })
            console.log(error)
        }
        else {
            res.json({ status:1,message: "Register successfully" })
        }
    })
}
exports.userLogin = (req, res) => {
    console.log(req.body)
    const { email, password } = req.body
    async.waterfall([
        function validation(callback) {
            if ( !email||!password ) {
                return callback(dataMsg.required_common)
            }
            if(!emailValidation(email)){
                return callback(dataMsg.required_emailMsg)
            }
            if(!passwordValidation(password)){
                return callback(dataMsg.required_passwordMsg)
            }
            callback(null, email, password)
        },
        function getUser(email, password, callback) {
           Selete.SelectUser(email,(error,result)=>{
                    if(error){
                         callback(error);
                    }
                    else{
                      return  callback(null,result,password)
                    } 
                })
        }, function comparepassword(result, password, callback) {
            bcrypt.compare(password, result.password, (error, match) => {
                if (error) {
                     callback(error)
                } if (!match) {
                      callback("Invalid password")
                }
                else{
                    return callback(null,result)
                }
            });
        }, function token(result, callback) {
            const token = jwt.sign({ id: result.id }, process.env.ACCESS_TOKEN, { expiresIn: process.env.EXPIRES })
            callback(null, token)
        }
    ], function (error, token) {
        if (error) {
            res.json({ status: 0, error: error })
            console.log(error)
        } else {
            res.status(200).json({ message: "Login successful", token })
        }
    })

}
exports.userUpdate = (req, res) => {
    const {id}=req.params
    const { email, name ,phone_no,DOB} = req.body
    async.waterfall([
        function validation(callback) {
            if ( !id||!email || !name ||!phone_no ||!DOB) {
                return callback(dataMsg.required_common)
            }
            if(!emailValidation(email)){
                return callback(dataMsg.required_emailMsg)
            }
            if(!nameValidation(name)){
                return callback(dataMsg.required_dofMsg)
            }
            if(!phoneValidation(phone_no)){
                return callback(dataMsg.required_phone_noMsg)
            }
            if(!dofValidation(DOB)){
                return callback(dataMsg.required_dofMsg)     
            }
            callback(null,id,email, name,phone_no,DOB)
        },function CheckExistingUser(id,email,name,phone_no,DOB,callback){
            Selete.SelectUser(email,(error,userExist)=>{
                if(error){
                     callback(error)
                }if (userExist){
                    return callback("User Exist")
                }
                else{
                   return callback(null,id,email,name,phone_no,DOB)
                }  
            })
        }, 
/*        function hashPassword(id,email,password, name, phone_no,DOB,callback) {
            console.log(req.body)
            const hash = bcrypt.hash(password, 9, (error, hash) => {
                if (error) {
                    callback(error)
                } 
                callback(null,id,email,hash,name,phone_no,DOB)
            })
        },*/ 
         function getvalues(id,email, name,phone_no,DOB,callback) {
             Update.UserUpdate(email,name,phone_no,DOB,id,(error,result)=>{
                if(error){
                    callback(error)
                }
                else{
                    return callback(null,result)
                }  
            })
        }
    ], function (error, result) {
        if (error) {
            res.json({ status: 0, error: error })
            console.log(error)
        } else {
            res.json({status:1, message:"User update successfully" })
        }
    })

}
/*exports.userEdit = (req, res) => {
    async.waterfall([
        function auth(callback) {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                res.status(405).json({ message: "invaild token" })

            } callback(null, token)
        }, function tokenVerifcation(token, callback) {
            const decode = jwt.verify(token, process.env.ACCESS_TOKEN)
            callback(null, decode)
        }

    ], function (error, decode) {
        if (error) {
            res.status(400).json({ error: error })
        } else {
            res.status(200).json({ message: "Token Access", decode })
            req.id=decode
        }
    })
}*/
exports.userDelete = (req, res) => {
    const { id } = req.params
    async.waterfall([
        function validate(callback) {
            if (!id) {
                return callback(dataMsg.required_common) 
            }
            callback(null, id)
        }, function getvalues(id, callback) {
            Delete.DeleteUser(id,(error,result)=>{
                if (error){
                    callback(error)
                }
                else{
                   return callback(null,result)
                }    
            }) 
        }
    ], function (error, result) {
        if (error) {
            res.json({ status: 0, error: error })
            console.log(error)
        } else {
            res.json({ status:1,message: "User Deleted" })
        }
    })
}



