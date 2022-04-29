const { authJwt } = require("../middleware");
const user = require("../controllers/profiler");
const req = require("express/lib/request");
const router = require("express-promise-router")();
router.delete("/del", user.delete);
router.put("/edit", user.edit);
//router.put("/edit", [authJwt.checkPassword, authJwt.checkBirthday, authJwt.checkEmail, authJwt.checkDuplicateEmail], user.edit);
router.get("/teste", (req, res) => {
    res.json({ message: "testando." });
});
module.exports = router;

