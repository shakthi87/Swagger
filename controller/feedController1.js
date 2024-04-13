const async = require('async')
const select = require('../mysql/select')
const helper = require('../helper')
const { error, result } = require('@hapi/joi/lib/base')


exports.AllFeedDetails = (req, res) => {
    let user_ids = []
    let feed_ids = []
    let userid = []
    let userids = []

    async.waterfall([
        function feedquery(callback) {
            select.SelectAllfeed((error, feed) => {
                if (error) {
                    callback(error, null)
                }
                else {
                    callback(null, feed)
                }
            })

        }, function likequery(feed, callback) {
            feed.forEach((item) => {
                user_ids.push(item.user_id)
                feed_ids.push(item.feed_id)
            })
            console.log(user_ids)
            console.log(feed_ids)
            select.SelectAllLike(feed_ids.toString(), (error, likes) => {
                if (error) {
                    callback(error, null)
                } else {
                    likes.forEach((like) => {
                        userid.push(like.user_id)
                    })
                    console.log(userid)
                    callback(null, feed, likes)
                }
            })
        }, function commentquery(feed, likes, callback) {

            select.SelectAllComment(feed_ids.toString(), (error, comment) => {
                if (error) {
                    callback(error, null)
                } else {
                    comment.forEach((cmts) => {
                        userids.push(cmts.user_id)
                    })
                    console.log(userids)
                    callback(null, feed, likes, comment)
                }
            })
        }, function userquery(feed, likes, comment, callback) {

            select.SelectAllUser(user_ids.toString(), (error, userD) => {
                if (error) {
                    callback(error, null)
                } else {
                    callback(null, feed, likes, comment, userD)
                }
            })
        },
        /*function array(feed,likes,comment,userD,callback) {
            const feeds = feed.map((feed) => {
                        userD.find(f => f.id === feed.user_id)
                        console.log(feed)
                        likes = likes.filter(f => f.feed_id === feed.feed_id)
                        console.log(likes)
                        comment = comment.filter(f => f.feed_id === feed.feed_id)
                        console.log(comment)
                        
                         
                        likes.map((like) => {
                              user_ids.find(f => f.user_id === like.user_id)
                              //const timeAgoL = helper.timecalculateTimeAgo(like.created_at)
                        })
                        comment.map((cmts) => {
                              user_ids.find(f => f.user_id === cmts.user_id)
                              //const timeAgoC = helper.timecalculateTimeAgo(cmts.created_at)
                     })
                     const timeAgoF = helper.timecalculateTimeAgo(feed.created_at)
                        const timeAgoL = helper.timecalculateTimeAgo(likes.created_at)
                        const timeAgoC = helper.timecalculateTimeAgo(comment.created_at)


                    return {
                         feed_id: feed.feed_id,
                         feed_description: feed.feed_description,
                         feed_media_url: feed.media_name,
                         feed_posted_user_id: feed.user_id,
                         feed_posted_user_name: userD.name,
                         feed_posted_time: timeAgoF,
                       likes: [{
                        like_id: likes.like_id,
                        like_user_id: likes.user_id,
                        like_user_name: likes.name,
                        like_time:timeAgoL
                  }],
                  comment: [{
                    comment_id: comment.comment_id,
                    comment_description: comment.comment,
                    comment_user_id: comment.user_id,
                    comment_user_name: comment.name,
                    comment_time:timeAgoC
              }]

              }
             
            }) 
             
                 callback(null,feeds)
        },*/
        function arraymethod(feed, likes, comment, userD, callback) {
            const feeds =
                feed.map((feed) => {
                    userD.find(f => f.id === feed.user_id);
                    likes= likes.filter(f => f.feed_id === feed.feed_id);
                    comment = comment.filter(f => f.feed_id === feed.feed_id);
                    const timeAgoF = helper.timecalculateTimeAgo(feed.created_at)
                    
                    console.log(feed)

                   likes.map((like) => {
                        userD.find(f => f.id === like.user_id)
                        const timeAgoL = helper.timecalculateTimeAgo(likes.created_at)
                       // console.log(likes)
                     
                    })


                    /*comment = comment.map((comment) => {
                        userD.find(f => f.id === comment.user_id)
                        const timeAgoC = helper.timecalculateTimeAgo(comment.created_at)
                       // console.log(comment)
                    }) */

                    /*   return{
                           feed_id: feed.feed_id,
                           feed_description: feed.feed_description,
                           feed_media_url: feed.media_name,
                           feed_posted_user_id: feed.user_id,
                           feed_posted_user_name: userD.name,
                           feed_posted_time: timeAgoF,
                           likes: [{
                            like_id: likes.like_id,
                            like_user_id: likes.user_id,
                            like_user_name: likes.name,
                            like_time:timeAgoL
                           }],
                          comment: [{
                            comment_id: comment.comment_id,
                            comment_description: comment.comment,
                            comment_user_id: comment.user_id,
                            comment_user_name: userD.name,
                            comment_time:timeAgoC
                          }] 
                      }*/
                    return {
                       feed,   
                       like: likes,
                       comment: comment
                    }
                })
            callback(null, feeds)

        }
    ], function (error, result) {
        if (error) {
            res.json({ status: 0, error: error })
        }
        else {
            // console.log(result)
            res.json({ status: 1, data: result })
        }
    })
}

