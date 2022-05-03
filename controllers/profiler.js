const db = require("../config/db.config.js");
const config = require("../config/auth.config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const authJwt = require("../middleware/authJwt.js");

/**
 * Resize a base 64 Image
 * @param {Date} odate - The base64 string (must include MIME type)
 */
function ajustDate (odate)
{
  console.log(odate.toLocaleDateString())
  return odate.toISOString().split("T")[0]
}

exports.insert = async (req, res) => {
  console.log(req)
  try{
    const {name, password, birthday, email} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const {rows} = await db.query(
      `INSERT INTO users (email, password, name, birthday, uuid, access_level, created_by, created_at, id_photo) VALUES ($1, $2, $3, to_timestamp(${new Date(birthday).getTime()} / 1000), $4, $5, $6, to_timestamp(${Date.now()} / 1000.0), $7) RETURNING *`,
      [email, hashedPassword, name, crypto.randomUUID(), 0, 0, 1]
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
    await authJwt.deleteToken(req, res);
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

    //console.log(photo);

    if(password){
      const hashedPassword = bcrypt.hashSync(password, 8);
      await db.query(
        `UPDATE users SET (email, password, name, birthday, updated_by, updated_at)=($1, $2, $3, to_timestamp(${new Date(birthday).getTime()+(1000*60*60*24)} / 1000), $4, to_timestamp(${Date.now()} / 1000.0)) WHERE id=$4;`,
        [email, hashedPassword, name, userid]
      );
    } else {
      await db.query(
        `UPDATE users SET (email, name, birthday, updated_by, updated_at)=($1, $2, to_timestamp(${new Date(birthday).getTime()+(1000*60*60*24)} / 1000), $3, to_timestamp(${Date.now()} / 1000.0)) WHERE id=$3;`,
        [email, name, userid]
      );
    }
    res.status(201).send({
      message: "Usuário editado com sucesso!",
      name: name,
      birthday: birthday,
      email: email
    });
  } catch(e) {
    res.status(500).send({
      message: e.message
    });
  }
};

exports.editPhoto = async (req, res) => {
  //console.log(req)
  try{
    const {id:userid} = req.user;
    const {photo} = req.body;
    const {rows} = await db.query(
      `INSERT INTO user_photo (image, created_by, created_at) VALUES ($1, $2, to_timestamp(${Date.now()} / 1000.0)) RETURNING *`,
      [photo, userid]
    );
    const photoid = rows[0].id;
    console.log(photoid);
    await db.query(
      `
      UPDATE users SET (id_photo, updated_by, updated_at)=($1, $2, to_timestamp(${Date.now()} / 1000.0)) WHERE id=$2
      `,
      [photoid, userid]
    );
    
    res.status(201).send({
      message: "Foto do perfil editada com sucesso!",
      photo: photo
    });
  } catch(e) {
    res.status(500).send({
      message: e.message
    });
  }
};

exports.view = async (req, res) => {
  try{
    const {id:userid} = req.user;
    const {rows} = await db.query(
      "SELECT * FROM users WHERE id = $1",
      [userid]
    );
    if(rows.length === 0) {
      res.status(401).send({
        message: "Usuário não encontrado!"
      });
    } else {
      const user = rows[0];
      res.status(200).send({
        message: "Usuário retornou dados com sucesso!",
        email: user.email,
        name: user.name,
        birthday: ajustDate(user.birthday),
        //photoid: user.photoid
      });
    }
  } catch(e) {
    res.status(500).send({
      message: e.message
    });
  }
};

exports.viewPhoto = async (req, res) => {
  try{
    const {id_photo:photoid} = req.user;
    const {rows} = await db.query(
      "SELECT * FROM user_photo WHERE id = $1",
      [photoid]
    );
    if(rows.length === 0) {
      res.status(401).send({
        message: "Foto não encontrada!"
      });
    } else {
      const photo = rows[0];
      res.status(200).send({
        message: "Foto retornada com sucesso!",
        photo: photo.image
      });
    }
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
      "SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL", // AND deleted_at IS NOT NULL
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
          token: token
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
