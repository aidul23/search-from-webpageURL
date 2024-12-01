require("dotenv").config({ path: "../.env" });
const { app } = require("./app");
const connectDB = require("./db/config");

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`✔️  server is running on ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`❌  Mongodb connection failed!!`, error);
  });
