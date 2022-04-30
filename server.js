require("dotenv").config()
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }))
app.use(cors());
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo ao aplicativo Alpha Edtech." });
});
const PORT = process.env.PORT || 3001;
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  app.listen(PORT, () =>{
      console.log(`Server is running on: http://${add}:${PORT}`);
      //console.log(err);
      //console.log(fam);
      console.log('rotas funcionais:');
      console.log('/user/teste (GET)');
      console.log('/user/del (DELETE)');
      console.log('/user/edit (PUT)');
      console.log('/auth/signup (POST)');
      console.log('/auth/signin (POST)');
  });
});
/*app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});*/
