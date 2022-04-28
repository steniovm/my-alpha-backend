const db = require("../config/db.config.js");
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
exports.insert = async (req, res) => {
  console.log(req)
  try{
    const {name, password, birthday, email} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const {rows} = await db.query(
      "INSERT INTO users (name, password, birthday, email, create_by, create_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [name, hashedPassword, birthday, email, req.user.id, new Date()]
    );
    res.status(201).send({
      message: "Usuário criado com sucesso!",
      user: rows[0]
    });
  } catch(e) {
    res.status(500).send({
      message: e.message
    });
  }
};
exports.validate = async (req, res) => {
  const {email, password} = req.body;
  try{
    const {rows} = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if(rows.length === 0) {
      res.status(401).send({
        message: "Usuário não encontrado!"
      });
    } else {
      const user = rows[0];
      if(bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({id: user.id}, config.secret, {                  
          expiresIn: 86400
        });
        res.status(200).send({
          message: "Usuário autenticado com sucesso!",
          token: token,
          user: user
        });
      } else {
        res.status(401).send({
          message: "Senha ou Usuário incorretos!"
        });
      }
    }
  } catch(e) {
    res.status(500).send({
      message: e.message
    });
  }
};
