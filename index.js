const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require('morgan')
const port = 3000;

let airFaderController = require("./airFaderController");

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Morgan Middleware
app.use(morgan('combined'))

app.post("/api/airfader", (req, res) => {
  airFaderController(req, res);
});

app.listen(port, () => console.log(`Listening on port ${port}!`));