require("dotenv").config({ path: ".env.development" }); //file .env
// require('dotenv').config({path: '.env.production'}) //file .env
const express = require("express");
const app = express();
const logger = require("morgan");

const PORT = process.env.PORT || 8080;

const MongoDB = require("./src/db/connections/mongodb");

if (process.env.ENV === 'development') {
	app.use(logger('dev'))
}
app.use(express.json()); // before routes

app.use("/api/v1", require("./src/routes/api.routes"));

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
