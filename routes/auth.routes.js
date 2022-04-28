const { verifySignUp } = require("../middleware");
const user = require("../controllers/profiler");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/signup", verifySignUp.checkDuplicateEmail, user.insert);
  app.post("/signin", user.validate);
};