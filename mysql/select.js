const { error, result } = require('@hapi/joi/lib/base');
const { reject } = require('async')

const db = require('./db_connect').pool

/*const querieS={
      select:(email)=>{
            return new Promise ((resolve,reject)=>{
                  db.query(`select * from userD where email=('${email}')`,(error,result)=>{
                        if(error){
                              reject(error)
                        }else{
                              resolve(result)

                        }
                  });
            });
      }
}*/
exports.SelectUser = function (email, callback) {
      const query = `select * from userD where email='${email}'`;
      db.query(query, (error, result) => {
            if (error) {
                  callback(error, null)
                  return;
            }
            if (result.length === 0) {
                  return callback(null, null)
            }
            callback(null, result[0])
      })

}
exports.Selectfeed = function (feed_id, callback) {
      const query = `select * from feed where feed_id='${feed_id}'`
      console.log(query)
      db.query(query, (error, result) => {
            if (error) {
                  callback(error, null)
                  return;
            }
            if (result.length === 0) {
                  return callback(null, null)
            }
            const filename = result[0].media_name
            console.log(filename)
            callback(null, filename)
      })
}
exports.seletelike = function (page, limit, callback) {
      const offset = (page - 1) * limit;
      const query = `select userD.name ,likes.feed_id,likes.created_at from userD 
                      inner join likes on userD.id=likes.user_id limit ${offset},${limit}`
      db.query(query, (error, result, fields) => {
            if (error) {
                  callback(error, null)
            }
            else {
                  return callback(null, result)
            }
      })
}
exports.seletelikeid = function (feed_id, user_id,callback) {
      const query = `select * from likes where feed_id='${feed_id}' and user_id='${user_id}' `
      console.log(query)
      db.query(query, (error, result) => {
            if (error) {
                  return callback(error, null)
            }
            else {
                  callback(null, result)
            }
      })
}
exports.SelectAFeed = function (page, limit, callback) {
      const offset = (page - 1) * limit
      const query =
            `select userD.name,feed.feed_description,feed.media_name,feed.created_at,likes.like_id,comment.comment from
       userD join feed on userD.id=feed.user_id 
       left join (select like_id,feed_id from likes limit 10)likes on feed.feed_id= likes.feed_id
       left join (select comment,feed_id from comment limit 10) comment on feed.feed_id = comment.feed_id
       limit ${offset},${limit} `
      console.log(query)
      db.query(query, (error, result, fields) => {
            if (error) {
                  callback(error, null)
            }
            else {
                  return callback(null, result)
            }
      })
}
exports.SelectAComment = function (page, limit, callback) {
      const offset = (page - 1) * limit;
      const query = `select userD.name,comment.feed_id,comment.comment,comment.created_at from 
                    userD inner join comment on userD.id=comment.user_id limit ${offset},${limit}`
   //   console.log(query)
      db.query(query, (error, result,fields) => {
            if (error) {
                  callback(error, null)
            } else {
                  return callback(null, result)
            }
      })
}
exports.SelectAllfeed=function(callback){
      const query=`select * from feed limit 10`
      console.log(query)
      db.query(query,(error,result,fields)=>{
            if(error){
                  callback(error,null)
            }
            else{
                  return callback(null,result)
            }
      })

}
exports.SelectAllLike=function(feed_id,callback){
      const query=`select * from likes where feed_id in (${feed_id})`
      console.log(query)
      db.query(query,(error,result,fields)=>{
            if(error){
                  callback(error,null)
            }
            else{
                  return callback(null,result)
            }
      })
}
exports.SelectAllComment=function(feed_id,callback){
      const query=`select * from comment where feed_id in(${feed_id})`
      console.log(query)
      db.query(query,(error,result,fields)=>{
            if(error){
                  callback(error,null)
            }
            else{
                 // console.log(result)
                  return callback(null,result)
                  
            }
      })
}
exports.SelectAllUser=function(user_id,callback){
      const query=`select * from userD where id in(${user_id})`
      console.log(query)
      db.query(query,(error,result,field)=>{
            if(error){
                  callback(error,null)
            }else{
                  //console.log(result)
                  return callback(null,result)
            }
      })
}
