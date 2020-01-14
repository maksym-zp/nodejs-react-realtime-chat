const mongoose = require('mongoose');
const Message = require('../models/messages');
const { getMongoDBurl, errorDbConnect } = require('../utils');

let result = {};
let status = 200;
const messageParams = [
    {
        $lookup:
            {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            },
    },
    { $unset: [ "__v", "user.__v", "user.password" ] },
    { $project: {
            "content": 1,
            "createdAt": 1,
            "updatedAt": 1,
            "user": { $arrayElemAt: [ "$user", 0 ] }
        }
    },
    { $sort : { createdAt : -1 } }

];
module.exports = {
    create: (req, res) => {
        mongoose.connect(getMongoDBurl(res), { useNewUrlParser : true }, (err) => {
            if (!err) {
                const {content, user, parentId} = req.body;
                var userId = user._id;
                const message = new Message({content, userId, parentId});
                message.save((err, message) => {

                    if (!err) {
                        var newMessage = Object.assign({}, message._doc);
                        newMessage.user = user;
                        result.status = status;
                        result.message = newMessage;
                    } else {
                        status = 500;
                        result.status = status;
                        result.error = err;
                    }
                    res.status(status).send(result);
                });
            }else{
                errorDbConnect(res, err);
            }
        });
    },
    update: (req, res) => {
        const { content } = req.body;
        mongoose.connect(getMongoDBurl(res), { useNewUrlParser: true }, (err) => {

            if (!err) {
                Message.findOneAndUpdate(
                    {'_id': req.params.id},
                    {$set: {content: content}},
                    {
                        new: true
                    },
                    (err, message) => {
                        if (!err && result !== null) {
                            result.status = status;
                            result.error = err;
                            result.message = message;
                        } else {
                            let result = {};
                            status = 500;
                            result.status = status;
                            result.error = err;
                        }
                        res.status(status).send(result);
                    });
            }else {
                errorDbConnect(res, err);
            }
        });
    },
    delete: (req, res) => {
        mongoose.connect(getMongoDBurl(res), { useNewUrlParser : true }, (err) => {
            if (!err) {
                let id = req.params.id;
                if(id){
                    Message.findOneAndDelete(
                        {'_id': id})
                        .then(message => {
                            if (!message) {
                                return res.status(404).send({
                                    message: "message not found with id " + id
                                });
                            }
                            res.send({
                                id: id,
                                message: "message deleted successfully!"
                            });
                        }).catch(err => {
                        if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                            return res.status(404).send({
                                message: "message not found with id " + id
                            });
                        }
                        return res.status(500).send({
                            message: "Could not delete message with id " + id
                        });
                    });
                }else{
                    return res.status(404).send({
                        message: "id not set"
                    });
                }

            }else {
                errorDbConnect(res, err);
            }
        });
    },
    all: (req, res) => {
        mongoose.connect(getMongoDBurl(res), { useNewUrlParser : true }, (err) => {
            if (!err) {
                Message.aggregate(messageParams, (err, messages) => {
                    if(!err){
                        result.status = status;
                        result.error = err;
                        result.messages = messages;
                    }else{
                        status = 500;
                        result.status = status;
                        result.error = err;
                    }
                    res.status(status).send(result);
                })
            }else {
                errorDbConnect(res, err);
            }
        });
    }
};
