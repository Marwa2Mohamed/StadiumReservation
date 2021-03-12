
const mongoose = require('mongoose');

const Playground = require('../../Models/playground/playground_model');
const Owner = require('../../Models/users/owners_model');

const fs = require("fs");
const path = require("path");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
var moment = require('moment');
moment().format();

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
};

exports.addOwnerPlayground = (req, res, next) => {
    const ownerId = req.body.owner_Id,
        playgroudID = new mongoose.Types.ObjectId();

    // creating the model object and adding simple format requests to fields 
    const newPlayground = new Playground({
        _id: playgroudID,
        playground_name: req.body.playground_name,
        owner_Id: ownerId,
        description: req.body.description,
        address: req.body.address,
        capacity: req.body.capacity,
        avaiable: req.body.avaiable
    });
    //insert the weekdays to the weekdays Array field of working day schema model
        extractWeekDays(req, newPlayground);
    //analyzing Images, add them to one string of path and sperate them by ,  
    

    // finished and saving it to db's playground collection
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
    // Add the new playground to db's owners collection
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

};
exports.getOwnerPlaygrounds = (req, res, next) => {
    Playground.find({ owner_Id: req.body.owner_Id }) //"owner_Id: req.params.owner_Id" changed to owner_Id: req.body.owner_Id
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

exports.deleteOwnerPlayground = (req, res, next) => {
    const imagesdir = '././products_images/';
    Owner.findByIdAndUpdate({
        _id: req.body.owner_Id,
        playgrounds: req.body.playground_Id
    }, { $set: { playgrounds: null } })
        .exec()

    Playground.findByIdAndDelete({
        owner_Id: req.body.owner_Id,
        _id: req.body.playground_Id
<<<<<<< HEAD
    }) //"owner_Id: req.params.owner_Id" changed to owner_Id: req.body.owner_Id
=======
    }) //"owner_Id: req.params.owner_Id" chgitanged to owner_Id: req.body.owner_Id
>>>>>>> a450b01 (weekDays json request is parsed and added to the owner's feature + address, capacity, available, times and prices)
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

function extractImages(req, newPlayground) {
    if (req.files) {
        let path = '';
        req.files.forEach((file, index, arr) => {
            path += file.path + ',';
        });

        path = path.substring(0, path.lastIndexOf(','));
        newPlayground.image = path;
    }
}

function extractWeekDays(req, newPlayground) {
        let weekDaysObject = JSON.parse(req.body.weekDays);
        console.log(weekDaysObject);
        console.log(typeof(weekDaysObject));
        weekDaysObject.forEach(element => {
            let startTime = moment(element.start_time, 'hh:mm'),
                endTime = moment(element.end_time, 'hh:mm');
            console.log(startTime);
            console.log(endTime);
            let aDay = {
                _id: new mongoose.Types.ObjectId(),
                dayName: element.dayName,
                start_time: new Date(startTime),
                end_time: new Date(endTime),
                hourPriceAM: parseFloat(element.hourPriceAM),
                hourPricePM: parseFloat(element.hourPricePM)
            }
            console.log(aDay.start_time.getHours());
            console.log(aDay.end_time.getHours());
            newPlayground.weekDays.push(aDay);
        });
        extractImages(req, newPlayground);
       
}