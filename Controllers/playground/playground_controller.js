const mongoose = require('mongoose');

const Playground = require('../../Models/playground/playground_model');
const Owner = require('../../Models/users/owners_model');


const fs = require("fs");
const path = require("path");

exports.getAllPlaygrounds = (req, res, next) => {
    // for admins
    Playground.find()
        .populate("owner_Id")
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

exports.addOwnerPlayground = (req, res, next) => {
    const ownerId = req.body.owner_Id;
    const newPlayground = new Playground({
        _id: new mongoose.Types.ObjectId(),
        playground_name: req.body.playground_name,
        owner_Id: ownerId,
        description: req.body.description,
        location: {
            type: 'Point',
            coordinates: req.body.coordinates
        },
        // start, end , week, priceperhourAM:0.0, priceperhourPM:0.0, location,
        address: req.body.address,
        //available: req.body.available, 
        //capacity: req.body.capacity
    });

    if (req.files) {
        let path = '';
        req.files.forEach((file, index, arr) => {
            path += file.path + ',';
        });

        path = path.substring(0, path.lastIndexOf(','));
        newPlayground.image = path;
    }

    newPlayground
        .save()
        .then(() => {
            res.status(201).json({
                message: 'newPlayground created successfully !',
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err,
            });
        });

    if (ownerId.match(/^[0-9a-fA-F]{24}$/)) {
        Owner.findById(ownerId)
            .then(owner => {
                console.log(owner)
                owner.playgrounds = newPlayground._id
                owner.save()
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err,
                });
            });
    } else {
        console.log("owner Id format is incorrect!");
        res.status(400).json({
            message: "owner Id format is incorrect!"
        });
    }

}
exports.getOwnerPlaygrounds = (req, res, next) => {
    Playground.find({
            owner_Id: req.body.owner_Id
        }) //"owner_Id: req.params.owner_Id" changed to owner_Id: req.body.owner_Id
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
};
/**output:[
    {
        "_id": "6020da73d3634023c44447e4",
        "playground_name": "\"playground 1\"",
        "owner_Id": "6020d77e03e9740070909705",
        "description": "\"playground one\"",
        "image": "products_images\\1612765811629_playground1.jpg,products_images\\1612765811640_playground2.jpg,products_images\\1612765811643_playground3.jpg",
        "__v": 0
    },
    {
        "_id": "6023519bde872350c4c18bf6",
        "playground_name": "\"playground 2\"", // do we have to check if the playground name found before??
        "owner_Id": "6020d77e03e9740070909705",
        "description": "\"playground two\"",
        "image": "products_images\\1612927387781_playground2.2.png,products_images\\1612927387786_playround2-1.jpeg",
        "__v": 0
    }
] */

exports.deleteOwnerPlayground = (req, res, next) => {
    const imagesdir = '././products_images/';

    Playground.findByIdAndDelete({
            owner_Id: req.body.owner_Id,
            _id: req.body.playground_Id
        }) //"owner_Id: req.params.owner_Id" changed to owner_Id: req.body.owner_Id
        .exec()
        .then(playgrounds => {
            if (playgrounds !== null) {
                let PlaygroundsSeperated = playgrounds.image.split(/[\\ ,]/); // turn the playground's images of the deleted ones from the DB into an array
                console.log(PlaygroundsSeperated);
                try {
                    fs.readdir(imagesdir, function (err, files) { //reads the folder files
                        // console.log(files);
                        files.forEach(function (file, index) { // iterate over these files

                            for (let index = 1; index < PlaygroundsSeperated.length; index++) { // index=1 because index=0 contains the folder name and is not needed

                                if (file === PlaygroundsSeperated[index]) {
                                    fs.unlink(path.join(imagesdir, file), (err) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(file + " is successfully deleted.")
                                        }
                                    }) // delete the file from the folder
                                }

                            }
                        })
                    })
                } catch (err) {
                    throw err
                }
                res.status(200).json({
                    message: `playground Id: ${playgrounds._id} that has ${playgrounds.playground_name} as a name is sucessfully deleted!`
                });

            } else if (playgrounds === null) {
                return res.status(404).json({
                    message: "Owner has no such playground!"
                });
            }
        })
        .catch(err => {

            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
};