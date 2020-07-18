const express = require("express");

const projectRouter = require("./projects/projectRouter.js");
const actionRouter = require("./actions/actionRouter.js");

const helmet = require("helmet");
const morgan = require("morgan");
const server = express();

server.use(helmet());
server.use(express.json());

server.use("/api/projects", projectRouter);
server.use("/api/projects/actions", actionRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Let's do some sprinting</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} Request`);
  next();
}

module.exports = server;
