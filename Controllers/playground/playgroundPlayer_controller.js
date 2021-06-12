
const Playground = require('../../Models/playground/playground_model');

exports.getNearPlaygrounds = (req, res, next) => {
    Playground.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [30.005632781395438, 31.188882783235936]
                    },
                    $maxDistance: 10000, // 10 kilo
                    $minDistance: 0
                }
                // $maxDistance: 100,
                // $minDistance: 10
            }
        })
        .exec()
        .then(playgrounds => {
            res.status(200).json(playgrounds);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
}
