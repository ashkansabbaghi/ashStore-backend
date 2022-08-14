require("dotenv").config({ path: ".env.development" }); //file .env
// require('dotenv').config({path: '.env.production'}) //file .env
const express = require("express");
const app = express();
const logger = require("morgan");
const createError = require("http-errors");
const PORT = process.env.PORT || 8080;

const MongoDB = require("./src/db/connections/mongodb");

if (process.env.ENV === "development") {
  app.use(logger("dev"));
}
app.use(express.static('public'));
app.use(express.json()); // before routes

app.use("/api/v1", require("./src/routes/api.routes"));

app.use(async (req, res, next) => {
  next(createError.NotFound("This path does not exist"));
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

MongoDB.connections
  .then(
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    })
  )
  .catch((e) => {
    console.log(e);
  });

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});

process.on("uncaughtException", (err, origin) => {
  `Caught exception: ${err}, Exception origin: ${origin}`;
});
