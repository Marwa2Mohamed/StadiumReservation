const express = require('express');
const router = express.Router();
const playgroundPlayerController = require('../../Controllers/playground/playgroundPlayer_controller');
const checkAuth = require('../../middleware/check_auth');

router.get("/getNearPlaygrounds", checkAuth, playgroundPlayerController.getNearPlaygrounds);

module.exports = router;