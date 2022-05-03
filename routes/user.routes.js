const { authJwt, verify } = require("../middleware");

const user = require("../controllers/profiler");
//const req = require("express/lib/request");
const router = require("express-promise-router")();
router.delete("/del", authJwt.verifyToken, user.delete);
router.put("/edit", [authJwt.verifyToken, verify.checkUpdatePassword, verify.checkBirthday, verify.checkEmail, verify.checkUpdateEmail], user.edit);
router.put("/editphoto", [authJwt.verifyToken], user.editPhoto);
router.get("/data", authJwt.verifyToken, user.view);
router.get("/photo", authJwt.verifyToken, user.viewPhoto);
//router.put("/edit", [authJwt.checkPassword, authJwt.checkBirthday, authJwt.checkEmail, authJwt.checkDuplicateEmail], user.edit);
router.get("/teste", authJwt.verifyToken, (req, res) => {
    res.json({ message: `Testando ${req.user.email} ...` });
});
module.exports = router;

