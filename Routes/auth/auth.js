const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const authController = require('../../Controllers/auth/auth');

/*
{
    "first_name" :"Marwa",
    "second_name":" AbdIlHamid",
    "phone_number" : "01023456587",
    "password":"Marwa_123",
    "type" : "owner"
}
 */
router.post("/login", authController.login);

router.post("/signUp",[ // for express validation
    check('first_name')
    .trim()
    .notEmpty()
    .withMessage('first_name is required')
    .matches('(^[a-zA-z\\s]{3,}$|^[\u0600-\u06FF\\s]{3,}$)')
    .withMessage('first_ name should contains only pure Arabic or English letters and/or spaces'),

    check('second_name')
    .trim()
    .notEmpty()
    .withMessage('second_name is required')
    .matches('(^[a-zA-z\\s]{3,}$|^[\u0600-\u06FF\\s]{3,}$)')
    .withMessage('second_name should contains only pure Arabic or English letters and/or spaces'),
    
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
    .withMessage('This password Must contains capital letters, small letters and symbol ')
], authController.signUp);

module.exports = router;

// (^[\u0600-\u06FF\s]{3,}$)