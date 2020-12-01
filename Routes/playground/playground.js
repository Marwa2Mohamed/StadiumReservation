const express = require('express');

const router = express.Router();

const playgroundController = require('../../Controllers/playground/playground_controller')

router.post("/addPlayground", playgroundController.addOwnerPlayground);
router.get("/getAllPlaygrounds", playgroundController.getAllPlaygrounds);



module.exports = router;