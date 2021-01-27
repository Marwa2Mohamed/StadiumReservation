//For admins
const express = require('express');

const router = express.Router();

const playerController = require('../../Controllers/user/player')

router.get("/getPlayers", playerController.getPlayers);



module.exports = router;