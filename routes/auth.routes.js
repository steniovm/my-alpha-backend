const { verifySignUp } = require("../middleware");
const user = require("../controllers/profiler");
const router = require("express-promise-router")();
router.post("/signup", verifySignUp.checkDuplicateEmail, user.insert);
router.post("/signin", user.validate);
module.exports = router;