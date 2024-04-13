const multer=require('multer')
const fs = require('fs')
const path = require('path')
const { error } = require('console')
const { required } = require('@hapi/joi')
const {dataMsg}=require('../dataMsg')

const storage =multer.diskStorage({
      destination: function(req,file,cb){
            cb(null,'files/');
      },filename:function(req,file,cb){
            //console.log("dddd",file)
            cb(null,Date.now()+path.extname(file.originalname));
      }
})
const fileFilter = function(req,file,cb){
      if (file.mimetype=='image/png'||file.mimetype=='image/jpg'||file.mimetype=='image/jpeg'||file.mimetype=='video/mp4'){
            cb(null,true)
      }else{
            cb(dataMsg.required_other_media);
      }
}
const upload=multer({storage:storage,fileFilter:fileFilter})

module.exports=upload