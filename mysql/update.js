const { error, result } = require('@hapi/joi/lib/base')
const { Result } = require('express-validator')

const db= require('./db_connect').pool

exports. UserUpdate=(email,name,phone_no,DOB,id,callback)=>{
      const query=(`update userD set email='${email}',name='${name}',phone_no='${phone_no}',DOB='${DOB}' where id='${id}'`)
      db.query(query,(error,result)=>{
            if(error){
                  callback(error,null)
                  return;
            }
            
            callback(null,result)
      })
}
exports. Feedupload=(feed_description,feed_id,callback)=>{
//      const query=(`update feed inner join userD on feed.user_id=userD.id set feed_description='${feed_description}'`)
      const query=`update feed set feed_description='${feed_description}'where feed_id='${feed_id}'`
      console.log(query)
      db.query(query,(error,result)=>{
            if(error){
                  callback(error,null)
                  return;
            }callback(null,result)
      })
}
exports.CommentUpdate=(comment_id,comment,callback)=>{
      const query=`update comment set comment='${comment}'where comment_id='${comment_id}'`
      console.log(query)
      db.query(query,(error,result)=>{
            if(error){
                  return callback(error,null)
            }else{
                  callback(null, result)
            }
      })
}
