const express = require('express');

const router = express.Router();

const userController = require('../../Controllers/user/user')

// GET / user/getUsers
router.get("/getUsers", userController.getUsers);

router.post("/login", userController.login);

router.post("/signUp", userController.createUser);

router.delete("/:userId", userController.deleteUser);

module.exports = router;