const express = require('express');
const router = express.Router();
const authentication = require('../../middleware/check_auth');
const {check, validationResult} = require('express-validator');

const stadiumStaffController = require('../../Controllers/user/stadiumstaff');
const { Router } = require('express');

router.get("/getAllStaff", authentication, stadiumStaffController.getAllStaff);
router.get("/getAStaff/:staffId", authentication, stadiumStaffController.getAStaff);

router.post("/addStaff", [ // for express validation
    check('first_name')
    .trim()
    .notEmpty()
    .withMessage('first_name is required')
    .matches('(^[a-zA-z\\s]{3,}$|^[\u0600-\u06FF\\s]{3,}$)')
    .withMessage('first_ name should contains only pure Arabic or English letters and/or spaces and at least 3 letters'),

    check('second_name')
    .trim()
    .notEmpty()
    .withMessage('second_name is required')
    .matches('(^[a-zA-z\\s]{3,}$|^[\u0600-\u06FF\\s]{3,}$)')
    .withMessage('second_name should contains only pure Arabic or English letters and/or spaces and at least 3 letters'),
    
    check('phone_number')
    .notEmpty()
    .withMessage('phone_number is required')
    .isLength({min:11,max:11})
    .withMessage("check your phone number length, no less or more than 11 digits") 
    .isMobilePhone("ar-EG")
    .withMessage("only an egyptian number is allowed"),

    check('password')
    .notEmpty()
    .withMessage('password is required')
    .isStrongPassword()
    .withMessage('This password is weak')
],authentication, stadiumStaffController.addStaff );

router.delete("/deleteAStaff/:staff_id", stadiumStaffController.deleteAstaff);


module.exports = router;