const express = require('express');
const router = express.Router();
const upload = require('../../Controllers/uploadingImages');
const playgroundController = require('../../Controllers/playground/playground_controller');
const checkAuth = require('../../check_auth/check_auth');

router.post("/addPlayground", checkAuth, upload.array('images[]'), playgroundController.addOwnerPlayground);

router.get("/getOwnerSpecificPlayground", checkAuth, playgroundController.getOwnerSpecificPlayground);
router.get("/getOwnerPlaygrounds", checkAuth, playgroundController.getOwnerPlaygrounds);
router.get("/getAllPlaygrounds", playgroundController.getAllPlaygrounds);

router.delete("/deleteOwnerPlaygrounds", checkAuth, playgroundController.deleteOwnerPlayground);
router.delete("/deletePlaygroundImages", checkAuth, playgroundController.deletePlaygroundImages);

router.patch("/editDescription",checkAuth, playgroundController.editDescription);
router.patch("/editAvailability",checkAuth, playgroundController.editAvailability);
router.patch("/editAddress",checkAuth, playgroundController.editAddress);
router.patch("/editWeekDays",checkAuth, playgroundController.editWeekDays);
router.patch("/addAnotherImage",upload.single('image'),checkAuth, playgroundController.addAnotherImage);


module.exports = router;