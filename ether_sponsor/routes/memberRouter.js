const express = require("express");
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    console.log(req.body.id, req.body.pw);
    //login process...
    res.send({ msg: "ok" });
  } catch (error) {
    console.error(error);
    res.send({ msg: error.message });
  }
});

module.exports = router;
