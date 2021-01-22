
const mongoose = require('mongoose');

const Playground = require('../../Models/playground/playground_model');
const Owner = require('../../Models/users/owners_model');

exports.getAllPlaygrounds = (req, res, next) => {
    Playground.find()
        // .populate("owner_Id")
        .exec()
        .then(playground => {
            console.log(playground);
            res.status(200).json(playground);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
}

exports.addOwnerPlayground = (req, res, next) => {
    const ownerId = req.body.owner_Id;
    const newPlayground = new Playground({
        _id: new mongoose.Types.ObjectId(),
        playground_name: req.body.playground_name,
        owner_Id: ownerId,
        description: req.body.description,
    });

    if (req.files) {
        let path = '';
        req.files.forEach((file, index, arr) => {
            path += file.path + ',';
        });

        path = path.substring(0, path.lastIndexOf(','));
        newPlayground.image = path;
    }

    newPlayground.save().then(() => {
        res.status(201).json({
            message: 'newPlayground created successfully !',
        });

    });
    if (ownerId.match(/^[0-9a-fA-F]{24}$/)) {
        Owner.findById(ownerId)
            .then(owner => {
                console.log(owner)
                owner.playgrounds = newPlayground._id
                owner.save()
            })
    } else {
        console.log("owner Id format is incorrect!");
        res.status(400).json({
            message: "owner Id format is incorrect!"
        });
    }

}
