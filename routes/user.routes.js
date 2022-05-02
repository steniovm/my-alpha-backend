const { authJwt, verifySignUp } = require("../middleware");

const user = require("../controllers/profiler");
//const req = require("express/lib/request");
const router = require("express-promise-router")();
router.delete("/del", authJwt.verifyToken, user.delete);
router.put("/edit", [authJwt.verifyToken, verifySignUp.checkPassword, verifySignUp.checkBirthday, verifySignUp.checkEmail, verifySignUp.checkUpdateEmail], user.edit);
router.get("/data", authJwt.verifyToken, user.data);
//router.put("/edit", [authJwt.checkPassword, authJwt.checkBirthday, authJwt.checkEmail, authJwt.checkDuplicateEmail], user.edit);
router.get("/teste", authJwt.verifyToken, (req, res) => {
    res.json({ message: `Testando ${req.user.email} ...` });
});
module.exports = router;

