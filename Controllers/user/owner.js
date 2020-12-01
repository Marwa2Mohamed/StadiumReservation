const Owner = require('../../Models/users/owners_model');
exports.getOwners = (req, res, next) => {
    Owner.find()
        .populate("playgrounds")
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