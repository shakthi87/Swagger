const async = require('async')

const Insert = require('../mysql/insert')
const Update=require('../mysql/update')
const select=require('../mysql/select')
const Remove=require('../mysql/delet')
const auth=require('../middleware/auth')
const {dataMsg}=require("../dataMsg")
const helper=require('../helper')
const fs =require('fs')
const { error, result } = require('@hapi/joi/lib/base')
const { body } = require('express-validator')


exports.InsertFeed = (req, res) => {
    //console.log(req.file,'==req')
  //  const user_id=req.id;
 /* const feedshema =joi.object({
    content:joi.string().when('feed_type',{
        in:'text',
        then:joi.required(),
        otherwise:joi.forbidden()
    }),
    feed_type:joi.string().valid('text','image','video').required()
 }).options({stripUnknown:true});*/
      
    // console.log(req.file.filename,'==req')
   
  /*  const {error}=feedshema.validate(req.body);
    if(error){
       return callback(error)
    }*/
 const { feed_type} = req.body
 const feed_description=req.body ?req.body.feed_description:null;
const media_name=req.file ? req.file.filename:null;
const user_id=req.id
    console.log(req.file)
     async.waterfall([
            function validation(callback){
                if(!feed_type){
                    return callback(dataMsg.required_type)
                }
                if (feed_type==='text'&&!feed_description){
                    return callback(dataMsg.required_descrption)
                }
                if((feed_type==='image'|| feed_type==='video')&& feed_description){
                    return callback(dataMsg.required_Cdescription)
                }
                if(feed_type==='text'&& req.file){
                    return callback(dataMsg.required_type)
                    
                }
                if ((feed_type==='image'|| feed_type==='video')&& ! req.file){
                    return callback(dataMsg.required_file)
                }
                callback(null,user_id,feed_type,feed_description,media_name)
            },
            function getvalue (user_id,feed_type,feed_description,media_name,callback) {
                    Insert.FeedInsert( user_id,feed_type,feed_description,media_name,(error, result) => {
                            if (error) {
                                  callback(error)
                            }
                            else {
                                  return callback(null, result)
                            }
                      })
               /* else if(data.feed_type==='image'||data. feed_type==='video'){
                    const media_name=req.file.filename
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
            }*/
      }], function (error, result) {
            if (error) {
                  res.json({ status: 0, error: error })
            } else {
                  res.json({ status: 1, message: 'save sucessfully' })
            }
      })

}

exports.UpdateFeed = (req, res) => {
    console.log(req.params)
    console.log(req.body)
    const {feed_id}=req.params
    const{feed_description}=req.body
    async.waterfall([
        function validator (callback){
            if(!feed_id){
                return callback(dataMsg.required_common)
            }
            if(!feed_description){
                return callback(dataMsg.required_descrption)
            }
            callback(null,feed_description,feed_id)
        },
        function getupdateFeed(feed_description,feed_id,callback){
            Update.Feedupload(feed_description,feed_id,(error,result)=>{
                if(error){
                     callback(error)
                }
                else{
                    return callback(null,result)
                }
            })
        }
    ],function(error,result){
        if (error) {
            res.json({ status: 0, error: error })
      } else {
            res.json({ status: 1, message: 'save sucessfully'})
      }
    })

}
exports.DeleteFeed = (req, res) => {
    const{feed_id}=req.params
    const path="files" 
    console.log(req.params)
    async.waterfall([
        function validation(callback){
            if(!feed_id){
                return callback(dataMsg.required_common)
            }
            callback(null,feed_id)
        },
        function fileselect(feed_id,callback){
            select.Selectfeed(feed_id,(error,result)=>{
                if (error){
                    callback(error)
                }
                else{ 
                    callback(null,result,feed_id)
                }
            }) 
        },
        function Filedelete(result,feed_id,callback){
            fs.unlink(path+'/'+result,function(error){
                if(error){
                    console.log(error)
                    callback(error)
                }else{
                    return callback(null,feed_id)
                }
               
            })
        },
        function getvalue(feed_id,callback){
            Remove.FeedDelete(feed_id,(error,result)=>{
                if(error){
                    callback(error,null)
                }else{
                    return callback(null,result)
                }    
            })
        }
    ],function(error,result){
        if (error) {
            res.json({ status: 0, error: error })
      } else {
            res.json({ status: 1, message: 'Deleted sucessfully' })
      }
    })
   

}

exports.SelectAllfeed=(req,res)=>{
    const {page,limit}=req.query
    async.waterfall([
        function validation(callback){
            if(!page){
                return callback(dataMsg.required_page)
            }
            if(!limit){
                return callback(dataMsg.required_limit)
            }
            callback(null,page,limit)

        },function selectalldetails(page,limit,callback){
            select.SelectAFeed(page,limit,(error,result)=>{
                if(error){
                    callback(error,null)
                }
                else{
                    callback(null,result)
                }
            })
        },
        function time(result,callback){
            const formattedTime=result.map(result=>{
                const timeAgo=helper.timecalculateTimeAgo(result.created_at)
                return{
                    name:result.name,
                    description:result.feed_description,
                    media:result.media_name,
                    like:result.like_id,
                    Comment:result.comment,
                    timeAgo:timeAgo,
                    likes:[{
                        like_id:result.like_id
                    }],
                    
                }
            })
            callback(null,formattedTime)
        }

    ],function(error,result){
        if(error){
            res.json({status:0,error:error})
        }
        else{
            res.json({status:1,message:result})
        }
    })
}