
const mongoose = require('mongoose');

const Playground = require('../../Models/playground/playground_model');
const Owner = require('../../Models/users/owners_model');

const fs = require("fs");
const path = require("path");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
var moment = require('moment');
moment().format();
const imagesdir = '././products_images/';

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

exports.getOwnerSpecificPlayground = (req, res, next) => {
    Playground.find({
        owner_Id: req.body.owner_Id,
        _id: req.body.playground_Id
    }) //"owner_Id: req.params.owner_Id" changed to owner_Id: req.body.owner_Id
        .exec()
        .then(playground => {
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

exports.editDescription = (req, res, next) => {
    Playground.findOneAndUpdate({
        _id: req.body.playground_Id,
        owner_Id: req.body.owner_Id
    }, { $set: { description: req.body.description }, useFindAndModify: true })
        .exec()
        .then(() => {
            res.status(200).json({
                editAcceptance: true
            })
        })
        .catch(err => {
            res.status(500).json({
                editAcceptance: false,
                error: err
            })
        });

};

exports.editAvailability = (req, res, next) => {
    Playground.findOneAndUpdate({
        _id: req.body.playground_Id,
        owner_Id: req.body.owner_Id
    }, { $set: { avaiable: req.body.avaiable } })
        .exec()
        .then(() => {
            res.status(200).json({
                editAcceptance: true
            })
        })
        .catch(err => {
            res.status(500).json({
                editAcceptance: false,
                error: err
            });
        });

};

exports.editAddress = (req, res, next) => {
    Playground.findOneAndUpdate({
        _id: req.body.playground_Id,
        owner_Id: req.body.owner_Id
    }, { $set: { address: req.body.address } })
        .exec()
        .then(() => {
            res.status(200).json({
                editAcceptance: true
            })
        })
        .catch(err => {
            res.status(500).json({
                editAcceptance: false,
                error: err
            });
        });
};

exports.editWeekDays = (req, res, next) => {
    let updateToDB = false;
    Playground.findOne({
        _id: req.body.playground_Id,
        owner_Id: req.body.owner_Id
    })
        .exec()
        .then(playground => { // by dayname
            // First: check if a day to be deleted in a document
            let Days = deleteDay(req, res, playground);
            //Second: check if to add a new day document
            let addDays = addDay(req, res, playground);
            addDays.forEach(newday => {
                Days.push(newday);
            })
            //Third check if any changes need to be done

            Playground.findOneAndUpdate({
                _id: req.body.playground_Id,
                owner_Id: req.body.owner_Id
            }, {$set:{weekDays:Days}})
            .exec()
            .then(() => {
                res.status(200).json({
                    editAcceptance: true
                });    
            })


        })
        .catch(err => {
            res.status(500).json({
                editAcceptance: false,
                error: err
            });
        });
}

exports.addAnotherImage = (req, res, next) => {
    Playground.findOne({
        owner_Id: req.body.owner_Id,
        _id: req.body.playground_Id
    })
        .exec()
        .then((playgroundOutput) => {

            playgroundOutput.image = addImage(req, res, playgroundOutput);
            Playground.updateOne({
                owner_Id: req.body.owner_Id,
                _id: req.body.playground_Id
            }, { $set: { image: playgroundOutput.image } })
                .exec()
                .then(() => {
                    res.status(200).json({
                        editAcceptance: true
                    })
                }).catch(err => {
                    res.status(500).json({
                        editAcceptance: false,
                        error: err
                    });
                });
        })
        .catch(err => {
            res.status(500).json({
                editAcceptance: false,
                error: err
            });
        });
};

exports.deletePlaygroundImages = (req, res, next) => {
    Playground.findOne({
        _id: req.body.playground_Id,
        owner_Id: req.body.owner_Id
    })
        .exec()
        .then(playgroundOutput => {
            let imageToDelete = JSON.parse(req.body.imageToDelete);


            // Delete the image(s) from the folder
            deleteSpecificImageFromFolder(req, res, imageToDelete, playgroundOutput);

            // Delete the image(s) from the document in db
            let PlaygroundsSeperated = playgroundOutput.image.split(/[\\ ,]/),
                newFieldValue = '';
            console.log(PlaygroundsSeperated);
            imageToDelete.forEach((image) => {
                for (let index = 1; index < PlaygroundsSeperated.length; index++) {
                    if (PlaygroundsSeperated[index] === image) {
                        delete PlaygroundsSeperated[index];
                        delete PlaygroundsSeperated[index - 1];
                        break; //until the timestamp is changed
                    }
                }
            });

            // convert it to string again

            for (let index = 0; index < PlaygroundsSeperated.length; index++) {
                if (PlaygroundsSeperated[index] === undefined) {
                    continue;
                } else if (index === (PlaygroundsSeperated.length - 1)) { // don't add , to the last filename
                    newFieldValue += PlaygroundsSeperated[index];
                } else if (PlaygroundsSeperated[index] === 'products_images') {
                    newFieldValue += PlaygroundsSeperated[index] + '\\';
                } else {
                    newFieldValue += PlaygroundsSeperated[index] + ',';
                }
            }

            // save it in the db
            Playground.findOneAndUpdate({
                _id: req.body.playground_Id,
                owner_Id: req.body.owner_Id
            }, { $set: { image: newFieldValue } })
                .exec()
                .then(() => {
                    res.status(200).json({
                        deleteAcceptance: true
                    })
                })
                .catch(err => {
                    res.status(500).json({
                        deleteAcceptance: false,
                        errorMessage: err
                    })
                })
        })
}

exports.deleteOwnerPlayground = (req, res, next) => {

    Owner.findByIdAndUpdate({
        _id: req.body.owner_Id,
        playgrounds: req.body.playground_Id
    }, { $set: { playgrounds: null } })
        .exec()

    Playground.findByIdAndDelete({
        owner_Id: req.body.owner_Id,
        _id: req.body.playground_Id
    }) //"owner_Id: req.params.owner_Id" chgitanged to owner_Id: req.body.owner_Id
        .exec()
        .then(playgrounds => {
            deleteImageFromFolder(req, res, playgrounds);
            res.status(200).json({
                message: `playground Id: ${playgrounds._id} that has ${playgrounds.playground_name} as a name is sucessfully deleted!`
            });
        })
        .catch(err => {

            console.log(err);
            res.status(500).json({
                error: err,
            });
        });
};


//analyzing Images, add them to one string of path and sperate them by ,  
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
    // console.log(weekDaysObject);
    // console.log(typeof (weekDaysObject));
    weekDaysObject.forEach(element => {
        let startTime = moment(element.start_time, 'hh:mm'),
            endTime = moment(element.end_time, 'hh:mm');
        // console.log(startTime);
        // console.log(endTime);
        let aDay = {
            dayName: element.dayName,
            start_time: new Date(startTime),
            end_time: new Date(endTime),
            hourPriceAM: parseFloat(element.hourPriceAM),
            hourPricePM: parseFloat(element.hourPricePM)
        }
        // console.log(aDay.start_time.getHours());
        // console.log(aDay.end_time.getHours());
        newPlayground.weekDays.push(aDay);
    });
    extractImages(req, newPlayground);

}

function addImage(req, res, playground) {

    if (req.file) {
        // create and add the new image(s)
        let playImage = '';
        playImage += playground.image + "," + req.file.path;
        return playImage;
    }
}

function addDay(req, res, playground) {
    let newDay = [],
        isNewDay = true, // is a new day
        reqDays = JSON.parse(req.body.weekDays);

    reqDays.forEach(days => {

        for (let index = 0; index < playground.weekDays.length; index++) {
            if (days.dayName === playground.weekDays[index].dayName) {
                isNewDay = false;
                break;
            }
        }

        if (isNewDay) {
            let startTime = moment(days.start_time, 'hh:mm'),
                endTime = moment(days.end_time, 'hh:mm'),
                aDay = {
                    dayName: days.dayName,
                    start_time: new Date(startTime),
                    end_time: new Date(endTime),
                    hourPriceAM: parseFloat(days.hourPriceAM),
                    hourPricePM: parseFloat(days.hourPricePM)
                }
            newDay.push(aDay);
        } else {
            isNewDay = true;
        }
    })

    // add All saved new days to DB

    return newDay;
}

function deleteDay(req, res, playground) {
    let Days = [],
        reqDays = JSON.parse(req.body.weekDays);

    playground.weekDays.forEach(days => {
        for (let index = 0; index < reqDays.length; index++) {
            if (days.dayName === reqDays[index].dayName) {
                Days.push(days);
                break;
            }
        }
    })

    // add All saved new days to DB
    return Days;
}

function deleteImageFromFolder(req, res, playground) {
    if (playground !== null) {
        let PlaygroundsSeperated = playground.image.split(/[\\ ,]/); // turn the playground's images of the deleted ones from the DB into an array
        // console.log(PlaygroundsSeperated);
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
    } else if (playground === null) {
        return res.status(404).json({
            message: "Owner has no such playground!"
        });
    }
}

function deleteSpecificImageFromFolder(req, res, deleteImages, playground) {

    if (playground !== null) {
        try {
            fs.readdir(imagesdir, function (err, files) { //reads the folder files
                files.forEach(function (file, index) { // iterate over these files
                    for (let index = 0; index < deleteImages.length; index++) {
                        // console.log('file: ' + typeof(file))
                        // console.log('deleteImages: ' + typeof(deleteImages[index]));
                        // console.log(file === deleteImages[index]);
                        if (file === deleteImages[index]) {
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
            });
        } catch (err) {
            throw err
        }
    } else if (playground === null) {
        return res.status(404).json({
            message: "Owner has no such playground!"
        });
    }

}