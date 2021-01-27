//For Admins
const express = require('express');

const router = express.Router();

const ownerController = require('../../Controllers/user/owner')

router.get("/getOwners", ownerController.getOwners);



module.exports = router;