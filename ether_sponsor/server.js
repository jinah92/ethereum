const express = require("express");
const path = require("path");

const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
const memberRouter = require("./routes/memberRouter");
app.use("/member", memberRouter);
const sponRouter = require("./routes/sponRouter");
app.use("/spon", sponRouter);

app.listen(3000, () => {
  console.log("3000 server ready....");
});
