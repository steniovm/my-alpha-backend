const express = require('express');
const port = process.env.PORT;
require('dotenv').config();
const app = express();

app.listen(port, () => {console.log(`O servidor foi iniciado em ${port}`)});