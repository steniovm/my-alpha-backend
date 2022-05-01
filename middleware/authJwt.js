const db = require("../config/db.config.js");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

async function searchUUID (uuid)
{
  console.log(`Searching ${uuid}...`)
  const {rows} = await db.query(
    "SELECT * FROM users WHERE uuid = $1",
    [uuid]
  );
  console.log(`Found ${rows.length}!`);
  return rows.length > 0 ? rows[0] : null;
}

async function createToken (uuid, res) 
{
  const token = jwt.sign({uuid: uuid}, config.secret);
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
    const user = await searchUUID(decoded.uuid);
    console.log(`Verified ${user.email}`);
    req.user = user;
    next();
  });
};

module.exports = {
  verifyToken,
  createToken,
  searchUUID
};
