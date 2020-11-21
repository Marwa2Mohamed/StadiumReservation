const express = require('express');

const router = express.Router();

const userController = require('../../Controllers/user/user')

// GET /user/getUsers
router.get("/getUsers", userController.getUsers);

// DELETE /user/getUsers/userId
router.delete("/:userId", userController.deleteUser);

module.exports = router;