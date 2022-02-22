require("dotenv").config();
require("../telegram/index");

const app = require("express")();
const redis = require("./redis");

const PORT = process.env.PORT || 3000;

app.listen(PORT, async function () {
  redis.client.connect();
  console.log(`Server is running at port ${PORT}`);
});
