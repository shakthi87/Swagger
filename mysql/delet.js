const { error, result } = require('@hapi/joi/lib/base')

const db = require('./db_connect').pool

/*const querieD={
      delete:(email)=>{
            return new Promise((resolve,reject)=>{
                  db.query("delete from userD where email=?",[email],(error,result)=>{
                        if (error){
                              reject(error)
                        }else{
                              resolve(result)
                        }
                  });
            });
      }
}*/
exports. DeleteUser=(id,callback)=>{
      const query=`delete from userD where id='${id}'`
      db.query(query,(error,result)=>{
            if(error){
                  callback(error,null)
                  return;
            }callback(result,null)
      })
}
exports. FeedDelete=(feed_id,callback)=>{
      const query=`delete from feed where feed_id='${feed_id}'`
      console.log(query)
      db.query(query,(error,result)=>{
            if(error){
                  callback(error,null)
                  return;
            }callback(null,result)
      })
}
exports.LikeDelete=function(feed_id,user_id,callback){
      const query=`delete from likes where feed_id='${feed_id}'and user_id='${user_id}'`
      console.log(query)
      db.query(query,(error,result)=>{
            if(error){
                  return callback(error,null)
            }
            else{
                  callback(null,result)
            }
      })
}
exports.CommentDelete=function(comment_id,callback){
      const query =`delete from comment where comment_id='${comment_id}'`
      console.log(query)
      db.query(query,(error,result)=>{
            if(error){
                  return callback(error,null)
            }
                  callback(null,result)
            
      })
}

