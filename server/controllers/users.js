const mongoose = require('mongoose');
const User = require('../models/users');
const bcrypt = require('bcrypt');
const { createToken, getMongoDBurl, errorDbConnect } = require('../utils');
var multer = require('multer');
const fs = require('fs');
var {mongoInit} = require('./dbConnect');

const userFieldsProtected = {
    __v: false,
    password: false
};
const usersFieldsProtected = {
    _id: false,
    __v: false,
    password: false
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/avatars')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' +file.originalname )
    }
});
var upload = multer({ storage: storage }).single('file');
let result = {};
let status = 200;
removeOldImage = (avatar) => {
    if(avatar){
        let path = 'public' + avatar;
        fs.unlink(path, (err) => {
            if (err) {
                console.log(err);

            }
            console.log('file removed');
        })
    }else{
        console.log('without avatar');
    }
};

module.exports = {
    register: (req, res) => {

        mongoose.connect(getMongoDBurl(res), { useNewUrlParser : true }, (err) => {

            if (!err) {

                const {name, password, email, password_confirmation} = req.body;
                let  avatar = null;
                const user = new User({name, password, email, password_confirmation, avatar});

                user.save((err, user) => {
                    if (!err) {
                        result.status = status;
                        result.user = {
                            _id: user._id,
                            name: user.name,
                            email: user.email

                        };
                        result.token = createToken(user);
                    } else {
                        status = 500;
                        result.status = status;
                        result.error = err;
                    }

                    res.status(status).send(result);
                });
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },
    login: (req, res) => {

        const { email, password } = req.body;
        mongoose.connect(getMongoDBurl(res), { useNewUrlParser: true }, (err) => {

            if(!err) {
                User.findOne({email}, function(err, user) {
                    if (!err && user) {
                        console.log('user', user);
                        bcrypt.compare(password, user.password).then(match => {
                            if (match) {
                                result.token = createToken(user);
                                result.status = status;
                                result.user = {
                                    _id: user._id,
                                    name: user.name,
                                    email: user.email,
                                    avatar: user.avatar,
                                };
                            } else {
                                status = 401;
                                result.status = status;
                                result.error =  {errors: {'password': 'Password is incorrect'}};
                            }
                            res.status(status).send(result);
                        }).catch(err => {
                            status = 500;
                            result.status = status;
                            result.error = err;
                            res.status(status).send(result);
                        });
                    } else {
                        status = 404;
                        result.status = status;
                        result.error = {errors: {'email': 'User with this email wasn`t find'}};
                        res.status(status).send(result);
                    }
                });
            } else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },
    userData: (req, res) => {
        const email = req.decoded.email;
        mongoose.connect(getMongoDBurl(res), { useNewUrlParser: true }, (err) => {

            if (!err) {
                User.findOne({email}, userFieldsProtected, function(err, result) {
                    if (!err) {
                        result.status = status;
                        result.error = err;
                        result.result = result;
                    } else {
                        status = 500;
                        result.status = status;
                        result.error = err;
                    }
                    res.status(status).send(result);
                });
            }else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },
    editUser: (req, res) => {
        const { _id, name, email } = req.body;
        mongoose.connect(getMongoDBurl(res), { useNewUrlParser: true }, (err) => {

            if (!err) {
                User.findOneAndUpdate(
                    {'_id': _id},
                    {$set: {name: name, email: email}},
                    {
                        "fields": userFieldsProtected,
                        new: true
                    },
                    (err, user) => {
                    if (!err && result !== null) {
                        result.status = status;
                        result.error = err;
                        result.user = user;
                        result.message = "success";
                    } else {
                        let result = {};
                        status = 500;
                        result.status = status;
                        result.error = err;
                    }
                    res.status(status).send(result);
                });
            }else {
                status = 500;
                result.status = status;
                result.error = err;
                res.status(status).send(result);
            }
        });
    },
    previewAvatar: (req, res) => {
        let result = {
            "name": "default-avatar.png",
            "status": "done",
            "url": "/images/avatars/default-avatar.png",
            "thumbUrl": "/images/avatars/default-avatar.png"
        };
        res.status(200).send(result);
    },
    editAvatar: (req, res) => {
        if(req.params && req.params.id){
            let userId = req.params.id;
            upload(req, res, function (err) {

                if (err instanceof multer.MulterError) {
                    return res.status(500).json(err)
                } else if (err) {
                    return res.status(500).json(err)
                }

                let path = req.file.path;
                path = path.replace(/public/i, '');

                User.findOne({_id: userId}, function(err, user) {
                    if(user){
                        const {avatar} = user;
                        removeOldImage(avatar);
                    }else{
                        let result = {
                            error: {errors: {'user': 'User not found'}},
                            status: 401
                        };
                        res.status(status).send(result);
                    }
                });

                User.update(
                    { _id: userId },
                    { $set: { avatar: path }}, function(err, user) {
                        if(user && user.ok === 1){
                            return res.status(200).send(req.file);
                        }else{
                            let result = {
                                error: {errors: {'credentials': 'Something is wrong!!!'}},
                                status: 401
                            };
                            res.status(status).send(result);
                        }
                    }
                );
            });
        }else{
            let result = {
                error: {errors: {'credentials': 'Something is wrong!!!'}},
                status: 401
            };
            res.status(status).send(result);
        }
    },

    all: (req, res) => {
        mongoose.connect(getMongoDBurl(res), { useNewUrlParser: true }, (err) => {

            if (!err) {
                User.find({'email': {$ne : req.decoded.email} }, usersFieldsProtected, function(err, users) {
                    if(!err){
                        result.status = status;
                        result.error = err;
                        result.users = users;
                    }else{
                        status = 500;
                        result.status = status;
                        result.error = err;
                    }
                    res.status(status).send(result);
                })
            }else{
                errorDbConnect(res, err);
            }
        });
    }
};

/** for testing
 userData: async (req, res) => {
        const email = req.decoded.email;
        let status = 200;
        try {
            let db = await mongoInit('users');
            let result = {};
            db.collection('users').findOne({email}, userFieldsProtected, function(err, user) {
                if (!err) {
                    result.status = status;
                    result.error = err;
                    result.result = user;
                    res.status(status).send(result.result);
                } else {
                    status = 500;
                    result.status = status;
                    result.error = err;
                    res.status(status).send(result);
                }

            });
        } catch (err) {
            status = 500;
            let result = {
                status: status,
                error: err,
            };
            res.status(status).send(result);
        }
    },
 */