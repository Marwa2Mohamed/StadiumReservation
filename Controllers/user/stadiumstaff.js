const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");
var stadiumstaff = require("../../Models/users/stadium_staff");

exports.addStaff = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).jsonp(errors.array());
  } // any non-validated error from the routes check methods for phone and password
  else {
    stadiumstaff
      .find({
        phone_number: req.body.phone_number,
      })
      .exec()
      .then((staff) => {
        if (staff.length > 0) {
          return res.status(409).json({
            message: "phone is exists",
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err,
              });
            } else {
              staff = new stadiumstaff({
                _id: new mongoose.Types.ObjectId(),
                first_name: req.body.first_name,
                second_name: req.body.second_name,
                phone_number: req.body.phone_number,
                password: hash,
                //actions: true,
                join_Date:req.body.join_Date,
                privilege: req.body.privilege
              })
                .save()
                .then(() => {
                  res.status(201).json({
                    message: "user created successfully !",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: err,
                  });
                });
            }
          });
        }
      });
  }
};

exports.getAllStaff = (req, res, next) =>{
  stadiumstaff.find()
  .exec()
  .then((staff) => {
    res.status(200).json({
      staff
    })
    
  }).catch((err) =>{
    res.status(500).json({
      error: err,
  });
  })
} 

exports.getAStaff = (req, res, next) =>{
  console.log(req.params.staffId);
  stadiumstaff.find({_id: req.params.staffId})
  .exec()
  .then((staff) => {
    res.status(200).json(staff)
    
  }).catch((err) =>{
    res.status(500).json({
      error: err,
  });
  })
} 

exports.deleteAstaff = (req, res, next) => {
  
  stadiumstaff
  .findByIdAndDelete({_id: req.params.staff_id})
  .exec()
  .then(deletedstaff => {
       res.status(200).json({
         deletedstaff: deletedstaff
       })
  })
  .catch(err => {
    res.status(500).json({
      err_message: err.message
    })
  })
}