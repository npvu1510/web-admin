const router = require("express").Router();
const upload = require("../../config/multer.config");
const profileController = require("./profileController");
/*************************** GET methods ***************************/
//render profile
router.get("/", profileController.renderProfile);

/*************************** POST methods ***************************/
//change avatar
router.post("/edit/change-avatar", upload.single('avatar_url'), profileController.changeAvatar);

module.exports = router;