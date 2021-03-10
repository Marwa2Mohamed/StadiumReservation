const express = require('express');
const router = express.Router();
const upload = require('../../Controllers/uploadingImages');
const playgroundController = require('../../Controllers/playground/playground_controller');
const checkAuth = require('../../middleware/check_auth');

router.post("/addPlayground", checkAuth, upload.array('images[]'), playgroundController.addOwnerPlayground);
router.get("/getOwnerPlaygrounds", checkAuth, playgroundController.getOwnerPlaygrounds); //":owner_Id" is removed
router.delete("/deleteOwnerPlaygrounds", checkAuth, playgroundController.deleteOwnerPlayground);
router.get("/getAllPlaygrounds", playgroundController.getAllPlaygrounds);
router.get("/getNearPlaygrounds", checkAuth,playgroundController.getNearPlaygrounds);



module.exports = router;