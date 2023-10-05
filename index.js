const config = require("config");
const express = require("express");
const app = express();
const genresRouter = require("./routes/genres");
const customersRouter = require("./routes/customers");
const movieRouter = require("./routes/movies");
const rentalRouter = require("./routes/rentals");
const homeRouter = require("./routes/home");
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const mongoose = require("mongoose");

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: JwtPrivateKey is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://127.0.0.1/skillsprint")
  .then(() => console.log("DB connection succesful..."))
  .catch((e) => console.log("DB connection failed..." + e.message));

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/", homeRouter);
require("./startup/prod")(app);

const port = process.env.PORT || 8080;
app.listen(port, "localhost", () =>
  console.log(`Listening on port ${port}...`)
);
