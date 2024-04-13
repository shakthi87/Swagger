const async = require('async')
const { dataMsg } = require('../dataMsg')
const Insert = require('../mysql/insert')
const Remove = require('../mysql/delet')
const Selete = require('../mysql/select')
const { error, result } = require('@hapi/joi/lib/base')
const { limit } = require('@hapi/joi/lib/common')

exports.AllLike = (req, res) => {
    console.log("====get all")
    function calculateTimeAgo(created_at) {
        const now = new Date();
        const timeDiff = now.getTime() - new Date(created_at).getTime();
        const secondsDiff = Math.round(timeDiff / 1000);
        const minutesdiff = Math.round(timeDiff / (1000 * 60))
        const hoursDiff = Math.round(timeDiff / (1000 * 60 * 60))
        const daysDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24))
        const monthsDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24 * 30))
        const yearsDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24 * 30 * 365))
        let formattedTime = '';
        if (yearsDiff > 1) {
            return formattedTime = `${yearsDiff} years ago`;
        }
        else if (monthsDiff) {
            return formattedTime = `${monthsDiff} months ago`
        }
        else if (daysDiff) {
            return formattedTime = `${daysDiff} days ago`
        }
        else if (hoursDiff) {
            return formattedTime = `${hoursDiff} hours ago`
        }
        else if (minutesdiff) {
            return formattedTime = `${minutesdiff} minutes ago`
        }
        else {
            return formattedTime = `${secondsDiff} seconds ago`
        }
    }
    console.log(req.query)
    const { page, limit } = req.query

    async.waterfall([
        function validation(callback) {
            if (!page) {
                return callback(dataMsg.required_page)
            }
            if (!limit) {
                return callback(dataMsg.required_limit)
            }
            callback(null, page, limit)
        },
        function getallvalues(page, limit, callback) {
            console.log("query")
            Selete.seletelike(page, limit, (error, result) => {
                if (error) {
                    console.log(error)
                    callback(error, null)
                } else {
                    callback(null, result)
                }
            })
        },
        function time(result, callback) {
            const formattedTime = result.map(result => {
                const timeAgo = calculateTimeAgo(result.created_at)
                return {
                    name: result.name,
                    feed_id: result.feed_id,
                    timeAgo: timeAgo
                }
            })
            callback(null, formattedTime)
        },
    ], function (error, result) {
        if (error) {
            res.json({ status: 0, error: error })
        } else {
            res.json({ status: 1, result: result })
        }

    })

}

exports.InsertLike = (req, res) => {
    console.log(req.query)
    const { feed_id } = req.query
    //  const {like_id}=req.body
    const user_id = req.id
    async.waterfall([
        function validation(callback) {
            if (!feed_id) {
                return callback(dataMsg.required_feed_id)
            }
            if (!user_id) {
                return callback(dataMsg.required_user_id)
            }
            callback(null, feed_id,user_id)
        }, function seletelikeid( feed_id, user_id,callback) {
            Selete.seletelikeid( feed_id, user_id,(error, results) => {
                if (error) {
                    callback(error, null)
                }
                if (results.length > 0) {
                    Remove.LikeDelete( feed_id,user_id, (error, result) => {
                        if (error) {
                            callback(error, null)
                        }
                        else {
                            return callback(null, "deleted")
                        }

                    })
                }
                else {
                    Insert.LikeInsert( feed_id, user_id,(error, result) => {
                        if (error) {
                            callback(error, null)
                        }
                        else {
                            callback(null, "inserted")
                        }
                    })
                }
            })
        }

    ], function (error, result) {
        if (error) {
            res.json({ status: 0, error: error })
        } else {
            res.json({ status: 1, message: result })
        }
    })
}

