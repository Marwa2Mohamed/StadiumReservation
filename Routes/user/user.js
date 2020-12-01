const express = require('express');

const router = express.Router();

const userController = require('../../Controllers/user/user')

// GET /user/getUsers
router.get("/getAllUser", userController.getAllUsers);


// DELETE /user/:userId
router.delete("/:userId", userController.deleteUser);

module.exports = router;