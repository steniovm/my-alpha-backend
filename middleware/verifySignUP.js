const db = require("../config/db.config.js");
checkDuplicateEmail = async (req, res, next) => {
  const email = req.body.email;
  const response = await db.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  if (response.rows.length > 0) {
    return res.status(400).send({
      message: "Email already in use!"
    });
  }
  next();
};
const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
 };
module.exports = verifySignUp;
