const Player = require('../../Models/users/players_model');

exports.getPlayers = (req, res, next) => {
    Player.find()
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