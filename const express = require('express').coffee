const express = require('express')
const Router=express.Router()
const feed=require('../controller/feedController')
const auth=require('../middleware/auth')
const upload=require('../middleware/file')


Router.post('/insert',auth.JWTValidation,upload.single('media_name'),feed.InsertFeed)

Router.put('/upload/:feed_id',auth.JWTValidation,feed.UpdateFeed)

Router.delete('/delete/:feed_id',auth.JWTValidation,feed.DeleteFeed)

module.exports=Router;  





 function validation(callback){
                if(!feed_type){
                    console.log("===111")
                    return callback(dataMsg.required_type)
                }
                if (feed_type==='text'&&!feed_description){
                    return callback(dataMsg.required_descrption)
                }
                
                if (feed_type ==='text'&& req.file){
                    return callback("Cannot use")
                }
                if(feed_type==='image'||feed_type==='video'&& !req.file){
                    return callback("Media file is required")
                }
                if(feed_type==='image'||feed_type==='video'&& req.file){
                    media_name=req.file.filename
                    console.log(req.file)
                }
                callback(null,feed_type,feed_description,media_name)
            },
        
            function getvalue (feed_type,feed_description,media_name,callback) {
                console.log("query part description query")
                if(feed_type==='text'){
                    console.log("inside if condition")
                    Insert.FeedInsert( feed_type, feed_description,(error, result) => {
                        console.log("not executed")
                            if (error) {
                                  callback(error)
                            }
                            else {
                                  return callback(null, result)
                            }
                      })
                }
                else if(feed_type==='image'|| feed_type==='video'){
                    console.log("query part media")
                    Insert.FeedInsert2(feed_type,media_name,(error,result)=>{
                        if(error){
                            callback(error)
                        }
                        else{
                            return callback(null,result)
                        }
                    })
                }
                callback(null,result)
            }
      ], function (error, result) {
            if (error) {
                  res.json({ status: 0, error: error })
            } else {
                  res.json({ status: 1, message: 'save sucessfully' })
            }
      })
}