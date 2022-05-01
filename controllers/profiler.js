const db = require("../config/db.config.js");
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
var crypto = require('crypto');
const authJwt = require("../middleware/authJwt.js");

exports.insert = async (req, res) => {
  console.log(req)
  try{
    const {name, password, birthday, email} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const {rows} = await db.query(
      `INSERT INTO users (email, password, name, birthday, uuid, access_level, created_by, created_at) VALUES ($1, $2, $3, to_timestamp(${new Date(birthday).getTime()} / 1000), $4, $5, $6, to_timestamp(${Date.now()} / 1000.0)) RETURNING *`,
      [email, hashedPassword, name, crypto.randomUUID(), 0, 0]
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

exports.delete = async (req, res) => {
  //console.log(req)
  try{
    let userComand = 0;
    const {id:userid} = req.user;
    const {rows} = await db.query(
      `UPDATE public.Users SET (deleted_by, deleted_at)=($1, to_timestamp($2 / 1000.0)) WHERE id=$3`,
      [userid, Date.now(), userid]
    );
    res.status(201).send({
      message: "Usuário deletado com sucesso!",
    });
  } catch(e) {
    res.status(500).send({
      message: e.message
    });
  }
};

exports.edit = async (req, res) => {
  //console.log(req)
  try{
    const {id:userid} = req.user;
    const {name, password, birthday, email} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    await db.query(
      `UPDATE users SET (email, password, name, birthday, updated_by, updated_at)=($1, $2, $3, to_timestamp(${new Date(birthday).getTime()} / 1000), $4, to_timestamp(${Date.now()} / 1000.0)) WHERE id=$4;`,
      [email, hashedPassword, name, userid]
    );
    res.status(201).send({
      message: "Usuário editado com sucesso!",
      name: name,
      birthday: birthday,
      email: email,
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
        const token = await authJwt.createToken(user.uuid, res);
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
