const mongoose = require('mongoose');
const User = require('../../Models/users/main_users_model');

exports.getAllUsers = (req, res, next) => {
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

exports.getSpecificUser = (req, res, next) => {
    User.findOne({_id:req.params.userId})
    .exec()
    .then(user => {
        console.log(user);
        res.status(200).json(user);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
}

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

