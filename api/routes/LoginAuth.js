// Importing Dependencies
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Importing Schema
const User = require("../Models/User");

router.post("/login", async (req, res) => {
  const loginUser = {
    email: req.body.email,
    password: req.body.password,
  };

  await User.findOne({
    email: loginUser.email,
  })
    .then(async (user) => {
      if (!user) return res.json({ message: "User doesnt exist" });

      const isMatch = await bcrypt.compare(loginUser.password, user.password);

      if (!isMatch)
        return res.status(400).json({ message: "Incorrect Password" });

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: "7 days",
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({
        message: "Server Error",
      });
    });
});

module.exports = router;