const db = require("../config/db.config.js");
checkDuplicateEmail = async (req, res, next) => {
  const email = req.body.email;
  const response = await db.query(
    "SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL",
    [email]
  );
  if (response.rows.length > 0) {
    return res.status(400).send({
      message: "Email já cadastrado!"
    });
  }
  next();
};
checkUpdateEmail = async (req, res, next) => {
  const email = req.body.email;
  const response = await db.query(
    "SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL",
    [email]
  );
  if (response.rows.length > 0 && req.user.email != email) {
    return res.status(400).send({
      message: "Email já cadastrado!"
    });
  }
  next();
};
checkPassword = async (req, res, next) => {
  const password = req.body.password;
  if(password.length != 8 || !password.match(/\d/)){
    return res.status(400).send({
      message: "A senha deve ter 8 caracteres e conter pelo menos um número!"
    });
  }
  next();
};
checkUpdatePassword = async (req, res, next) => {
  const password = req.body.password;
  if(password && (password.length != 8 || !password.match(/\d/))){
    return res.status(400).send({
      message: "A senha deve ter 8 caracteres e conter pelo menos um número!"
    });
  }
  next();
};
checkEmail = async (req, res, next) => {
  const email = req.body.email;
  if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
    console.log(email);
    return res.status(400).send({
      message: "Email inválido!"
    });
  }
   next();
};
checkBirthday = async (req, res, next) => {
  let birthday = req.body.birthday;
  birthday = birthday.split("T")[0];
  if(!birthday.match(/^\d{4}\/\d{2}\/\d{2}$/) && !birthday.match(/^\d{4}-\d{2}-\d{2}$/)){
    //console.log(birthday);
    return res.status(400).send({
      message: `Data de nascimento inválida! ${birthday}`
    });
  }
  console.log(birthday);
  req.body.birthday = birthday;
  next();
};
const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkPassword: checkPassword,
  checkEmail: checkEmail,
  checkBirthday: checkBirthday,
  checkUpdateEmail,
  checkUpdatePassword
 };
module.exports = verifySignUp;
