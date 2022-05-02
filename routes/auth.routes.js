const { verify } = require("../middleware");
const user = require("../controllers/profiler");
const router = require("express-promise-router")();
router.post("/signup",  [verify.checkPassword, verify.checkBirthday, verify.checkEmail, verify.checkDuplicateEmail], user.insert);
router.post("/signin", user.validate);
module.exports = router;