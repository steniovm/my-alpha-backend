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
      `INSERT INTO users (email, password, name, birthday, uuid, access_level, created_by, created_at) VALUES ($1, $2, $3, to_timestamp(${new Date(birthday).getTime()} / 1000), $4, $5, $6, to_timestamp(${Date.now()} / 1000.0)) RETURNING *`,
      [email, hashedPassword, name, req.uuid, req.access_level, req.user_id]
    );
    res.status(201).send({
      message: "Usuário criado com sucesso!",
      name: rows[0].name,
      birthday: rows[0].birthday,
      email: rows[0].email,
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
      const match = await bcrypt.compare(password, user.password);
      if(match) {
        const token = jwt.sign({id: user.id}, config.secret, {
          expiresIn: 86400
        });
        res.status(200).send({
          message: "Usuário autenticado com sucesso!",
          token: token,
          email: user.email,
          birthday: user.birthday
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
