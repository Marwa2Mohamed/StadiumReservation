const express = require('express');
const router = express.Router();
const upload = require('../../Controllers/uploadingImages');
const playgroundController = require('../../Controllers/playground/playground_controller');
const checkAuth = require('../../check_auth/check_auth');

router.post("/addPlayground/:owner_Id", checkAuth, upload.array('images[]'), playgroundController.addOwnerPlayground);
router.post("/addWorkingDay/:playground_Id", checkAuth, playgroundController.addWorkingDay);

router.get("/getOwnerSpecificPlayground/:playground_Id", checkAuth, playgroundController.getOwnerSpecificPlayground);
router.get("/getOwnerPlaygrounds/:owner_Id", checkAuth, playgroundController.getOwnerPlaygrounds);
router.get("/getAllPlaygrounds", playgroundController.getAllPlaygrounds);

router.delete("/deleteOwnerPlaygrounds", checkAuth, playgroundController.deleteOwnerPlayground);
router.delete("/deletePlaygroundImages/:playground_Id", checkAuth, playgroundController.deletePlaygroundImages);
router.delete("/deleteWorkingDay/:playground_Id",checkAuth, playgroundController.deleteWorkingDay);

router.patch("/editDescription/:playground_Id",checkAuth, playgroundController.editDescription);
router.patch("/editAvailability/:playground_Id",checkAuth, playgroundController.editAvailability);
router.patch("/editAddress/:playground_Id",checkAuth, playgroundController.editAddress);
router.patch("/editWeekDays/:playground_Id",checkAuth, playgroundController.editWeekDays);
router.patch("/addAnotherImage/:playground_Id",upload.single('image'),checkAuth, playgroundController.addAnotherImage);


module.exports = router;