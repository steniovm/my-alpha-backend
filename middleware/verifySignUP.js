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
checkPassword = async (req, res, next) => {
  const password = req.body.password;
  if(password.length != 8 || !password.match(/\d/)){
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
  const birthday = req.body.birthday;
  if(!birthday.match(/^\d{4}\/\d{2}\/\d{2}$/)){
    console.log(birthday);
    return res.status(400).send({
      message: "Data de nascimento inválida!"
    });
  }
  next();
};
const verifySignUp = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkPassword: checkPassword,
  checkEmail: checkEmail,
  checkBirthday: checkBirthday
 };
module.exports = verifySignUp;
