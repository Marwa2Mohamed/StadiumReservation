const express = require('express');
const router = express.Router();
const upload = require('../../Controllers/uploadingImages');
const playgroundController = require('../../Controllers/playground/playground_controller');
const checkAuth = require('../../check_auth/check_auth');

router.post("/addPlayground", checkAuth, upload.array('images[]'), playgroundController.addOwnerPlayground);
router.get("/getOwnerPlaygrounds/:owner_Id", checkAuth, playgroundController.getOwnerPlaygrounds);
router.get("/getAllPlaygrounds", playgroundController.getAllPlaygrounds);



module.exports = router;