require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
var corsOptions = {
  origin: "http://localhost:3000"
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const db = require("./models");
const Role = db.role;
db.sequelize.sync().then(() => {
  console.log("This creates the table if it doesn't exist");
});
app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo ao aplicativo Alpha Edtech." });
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
