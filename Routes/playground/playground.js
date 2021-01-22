const express = require('express');
const router = express.Router();
const upload = require('../../Controllers/uploadingImages');
const playgroundController = require('../../Controllers/playground/playground_controller')

router.post("/addPlayground",  upload.array('images[]'), playgroundController.addOwnerPlayground);
router.get("/getAllPlaygrounds", playgroundController.getAllPlaygrounds);



module.exports = router;