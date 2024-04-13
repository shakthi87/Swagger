const async = require('async')
const { dataMsg } = require("../dataMsg")
const Insert = require('../mysql/insert')
const Update=require('../mysql/update')
const Remove=require('../mysql/delet')
const select=require('../mysql/select')
const { error, result } = require('@hapi/joi/lib/base')

exports.InsertComment = (req, res) => {
      const user_id = req.id
      const { feed_id, comment } = req.body
      async.waterfall([
            function validation(callback) {
                  if (!user_id) {
                        return callback(dataMsg.required_user_id)
                  }
                  if (!feed_id) {
                        return callback(dataMsg.required_feed_id)
                  } if (!comment) {
                        return callback(dataMsg.required_Comment)
                  }
                  callback(null, user_id, feed_id, comment)
            }, function getvalue( user_id, feed_id,comment, callback) {
                  Insert.CommentInsert( user_id,feed_id, comment, (error, result) => {
                        if (error) {
                              callback(error, null)
                        } else {
                              callback(null, result)

                        }
                  })
            }
      ], function (error, result){
        if(error){
            res.json({status:0,error:error})
        }
        else{
            res.json({status:1,message:"Comment Added"})
        }
      })
}

exports.UpadateComment=(req,res)=>{
    const{comment}=req.body
    const {comment_id}=req.params
    async.waterfall([
        function validation (callback){
            if(!comment_id){
                return callback(dataMsg.required_comment_id)
            }if(!comment){
                return callback(dataMsg.required_Comment)
            }
            callback(null,comment_id,comment)
        },function getupdateComment(comment_id,comment,callback){
            Update.CommentUpdate(comment_id,comment,(error,result)=>{
                if(error){
                    callback(error,null)
                }else{
                    callback(null,result)
                }
            })

        }
    ],function(error,result){
        if(error){
            res.json({status:0,error:error})
        }
        else{
            res.json({status:1,message:"Comment Updated"})
        }
    })
}

exports.DeleteComment=(req,res)=>{
    const{comment_id}=req.params
    async.waterfall([
        function validation(callback){
            if(!comment_id){
                return callback(dataMsg.required_comment_id)
            }
            callback(null,comment_id)
        },function getvalue(comment_id,callback){
            Remove.CommentDelete(comment_id,(error,result)=>{
                if(error){
                     callback(error,null)
                }else{
                    return callback(null,result)
                }
            })

        }

    ],function(error,result){
        if(error){
            res.json({status:0,error:error})
        }else{
            res.json({status:1,message:"Comment Deleted"})
        }
    })
}

exports.AllComments=(req,res)=>{
    function calculateTimeAgo(created_at){
        const now=new Date();
        const timeDiff=now.getTime()-new Date(created_at).getTime();
        const secondsDiff=Math.round(timeDiff/1000);
        const minutesdiff=Math.round(timeDiff/(1000*60))
        const hoursDiff=Math.round(timeDiff/(1000*60*60))
        const daysDiff=Math.round(timeDiff/(1000*60*60*24))
        const monthsDiff=Math.round(timeDiff/(1000*60*60*24*30))
        const yearsDiff=Math.round(timeDiff/(1000*60*60*24*30*365))
        let formattedTime='';
        if(yearsDiff>1){
              return formattedTime=`${yearsDiff} years ago`;
        }
        else if(monthsDiff){
          return  formattedTime=`${monthsDiff} months ago`
        }
        else if(daysDiff){
          return formattedTime=`${daysDiff} days ago`
        }
        else if(hoursDiff){
          return  formattedTime=`${hoursDiff} hours ago`
        }
        else if(minutesdiff){
          return formattedTime=`${minutesdiff} minutes ago`
        }
        else{
          return formattedTime=`${secondsDiff} seconds ago`
        }

    }
    console.log(req.query)
    const{page,limit}=req.query
    async.waterfall([
        function validation(callback){
            if(!page){
                return callback(dataMsg.required_page)
            }
            if(!limit){
                return callback(dataMsg.required_limit)
            }
            callback(null,page,limit)
        },
        function getallvalues(page,limit,callback){
            select.SelectAComment(page,limit,(error,result)=>{
                if(error){
                    callback(error,null)
                }
                else{
                    return callback(null,result)
                }
            })
        },
        function Time(result,callback){
            const formattedTime=result.map(result=>{
                const timeAgo=calculateTimeAgo(result.created_at)
                return{
                    name:result.name,
                    feed_id:result.feed_id,
                    comment:result.comment,
                    timeAgo:timeAgo
                }
            })
            callback(null,formattedTime)
        }
    ],function(error,result){
        if(error){
            res.json({status:0,error:error})
        }
        else{
            res.json({status:1,result:result})
        }
    })
}
