
const db = require('../mysql/db_connect').pool
const { error, result } = require('@hapi/joi/lib/base');
const auth=require('../middleware/auth');
const { decode } = require('jsonwebtoken');


exports. CreateUser = function (email, password, name, phone_no, DOB, callback) {
      const query = `insert into userD(email,password,name,phone_no,DOB)values('${email}','${password}','${name}','${phone_no}','${DOB}')`
      db.query(query, (error, result, field) => {
            if (error) {
                  callback(error, null);
                  return;
            }
            callback(null, result)

      });
};
exports.FeedInsert =
      function insert (user_id,feed_type,feed_description,media_name, callback) {
      console.log('token id getting part')
      //console.log("token id",result.insertID)
   //const query = `insert into feed(feed_description,feed_type)values('${feed_description}','${feed_type}') select id form userD where user_id='${id}'`
    const query=`insert into feed(user_id,feed_type,feed_description,media_name)values('${user_id}','${feed_type}','${feed_description}','${media_name}')`
    console.log(query)
    db.query(query, (error, result,field) => {
            if (error) {
                  console.log(error)
                  callback(error, null)
                  return;
                 
            }
            callback(null, result)
    });

}
/*exports.FeedInsert2=function insert_media(feed_type,media_name,callback){
      const user_id=req.decode.id
      const query=`insert into feed(user_id,feed_type,media_name)values('${user_id}','${feed_type}','${media_name}')`
      console.log(query)
      db.query(query,(error,result)=>{
            if(error){
                  callback(error,null);
                  return;
            }
            callback(null,result)
      })
}*/

exports.LikeInsert=
      function insert(feed_id,user_id,callback){
            const query=`insert into likes(feed_id,user_id)values('${feed_id}','${user_id}')`
            console.log(query)
            db.query(query,(error,result)=>{
                  if (error){
                        return callback(error,null);
                  }
                  else{
                        callback(null,result)
                  }
            })

}

exports.CommentInsert=function insert(user_id,feed_id,comment,callback){
      const query=`insert into comment(user_id,feed_id,comment)values('${user_id}','${feed_id}','${comment}')`
      console.log(query)
      db.query(query,(error,result)=>{
            if(error){
                  return callback(error,null)
            }else{
                  callback(null,result)
            }
      })
}