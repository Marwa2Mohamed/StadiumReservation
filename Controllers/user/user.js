const mongoose = require('mongoose');
const User = require('../../Models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getUsers = (req, res, next) => {
    User.find()
        .exec()
        .then(users => {
            console.log(users);
            res.status(200).json(users);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
};

exports.createUser = (req, res, next) => {
    User.find({ phone_number: req.body.phone_number }).exec().then(users => {
        if (users.length > 0) {
            return res.status(409).json({
                message: 'phone is exists',
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err,
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        first_name: req.body.first_name,
                        second_name: req.body.second_name,
                        phone_number: req.body.phone_number,
                        password: hash,
                    });

                    user
                        .save()
                        .then(() => {
                            res.status(201).json({
                                message: 'user created successfully !',
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(500).json({
                                error: err,
                            });
                        });
                }
            });
        }
    });
};

exports.deleteUser = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
        .exec()
        .then(e => {
            console.log(e);
            res.status(200).json({
                message: 'User Deleted',
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err,
            });
        });
};

exports.login = (req, res, next) => {
    User.findOne({ phone_number: req.body.phone_number }).exec().then(user => {
        if (user) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({
                            phone_number: user.phone_number,
                            userId: user._id,
                        },
                        'secret'
                    );
                    // res.header("auth_token", token).send(token)
                    res.status(200).json({
                        message: 'Auth seccessful',
                        token: token
                    });

                } else {
                    res.status(401).json({
                        message: 'password incorrect',
                    });
                }
            });
        } else {
            res.status(401).json({
                message: "your phone number doesn't exist",
            });
        }
    });
};