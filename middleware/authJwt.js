const db = require("../config/db.config.js");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const crypto = require('crypto');
const sessions = {};

async function searchUUID (uuid)
{
  // AND deleted_at IS NOT NULL
  console.log(`Searching ${uuid}...`)
  const {rows} = await db.query(
    "SELECT * FROM users WHERE uuid = $1 AND deleted_at IS NULL",
    [uuid]
  );
  console.log(`Found ${rows.length}!`);
  return rows.length > 0 ? rows[0] : null;
}

async function createToken (uuid, res) 
{
  if(!uuid){
    return "";
  }

  //const sessionID = {id:session.id, uuid:session.useruuid};
  const session = {id:crypto.randomUUID(), useruuid:uuid, startTime:new Date().toUTCString().split("T"[0])};
  const tokenData = {id:session.id, userid:session.useruuid};
  const token = jwt.sign(tokenData, config.secret);
  console.log(session);
  sessions[`${tokenData.id},${tokenData.userid}`] = session;
  console.log(session, sessions);
  res.cookie('token', `${token}`, 
    { 
        maxAge: 900000,
        //domain:"localhost",
        //path: "http://localhost:3000",
        //path:"/",
        sameSite: "None",
        secure: false
    });
  return token;
}

async function deleteToken (req, res) 
{
  if(!req.user){
    res.status(401).send({
      message: "Sessão não encontrada!"
    });
  }

  const {uuid, sessionid} = req.user;
  console.log(req.user);
  delete sessions[`${sessionid},${uuid}`];
  //console.log(session, sessions);
  res.cookie('token', ``, 
    { 
        maxAge: 0,
        //domain:"localhost",
        //path: "http://localhost:3000",
        //path:"/",
        sameSite: "None",
        secure: false
    });

  res.status(201).send({
    message: "Logout feito com sucesso!"
  });
}

async function verifyToken (req, res, next)
{
  //console.log(req.cookies)
  const token = req.cookies ? req.cookies["token"] : null;//req.headers["x-access-token"];
  //console.log(token)
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }
  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    const session = sessions[`${decoded.id},${decoded.userid}`];
    if(session) {
      const user = await searchUUID(session.useruuid);
      if(user)
      {
        console.log(`Verified ${user.email}`);
        user.sessionid = session.id;
        req.user = user;
        next();
      }
    }
  });
};

module.exports = {
  verifyToken,
  createToken,
  deleteToken,
  searchUUID
};
