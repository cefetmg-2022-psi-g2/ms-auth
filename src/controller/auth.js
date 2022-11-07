const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const bdHelper = require("framework");
const validator = require("validator");
const Profile = require("../model/Profile");
const User = require("../model/User");
const authUtils = require("../utils/auth");

const router = Router();

router.post("/login", (req, res) => {
  const { password, username } = req.body;
  if (username && password) {
    if (
      validator.isAlphanumeric(username, ["pt-BR"]) &&
      password.length > 6 &&
      password.length < 32
    ) {
      // Data is valid, but not yet checked
      authUtils
        .login("username", username, password)
        .then((result) => {
          // If the login is successful, the token is generated and sent to the user
          if (result == true) {
            try {
              const token = authUtils.genJwt(username);
              res.status(200).send({ token: token });
              return;
            } catch (err) {
              res.status(500).send("Internal Server Error");
              console.log(err);
              return;
            }
          }
          // If the login is not successful, the user is informed that the username or password is incorrect
          res.status(401).send("Wrong username or password");
        })
        .catch((err) => {
          res.status(500).send("Internal Server Error");
        });
    } else {
      res.status(400).send("Bad Request");
    }
  } else {
    res.status(400).send("Bad Request");
  }
});

router.post("/signup", async (req, res) => {
  const { name, username, password, email, dateBirth, phone, gender } =
    req.body;
  try {
    const user = User.createUser(
      name,
      Profile.createProfile(username, password, email, dateBirth, phone, gender)
    );
    const salt = await bcryptjs.genSalt(10);
    const passwordHash = await bcryptjs.hash(user.profile.password, salt);
    bdHelper
      .insertInto(
        "usuario",
        [
          "name",
          "username",
          "score",
          "num_pedidos",
          "password",
          "email",
          "date_birth",
          "phone",
          "gender",
        ],
        [
          user.name,
          user.profile.username,
          user.score,
          user.numPedidos,
          passwordHash,
          user.profile.email,
          user.profile.dateBirth,
          user.profile.phone,
          user.profile.gender,
        ]
      )
      .then((result) => {
        res.status(200).send();
      })
      .catch((err) => {
        if (err.errno == 19) {
          res.status(409).send("User already exists");
        } else {
          res.status(400).send("Bad Request");
        }
      });
  } catch (e) {
    if (e.message === "Invalid profile data") {
      res.status(400).send("Bad Request");
    } else {
      res.status(500).send("Internal Server Error");
    }
  }
});

router.post("/validate", (req, res) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    try {
      const decoded = authUtils.decodeJwt(token);
      bdHelper
        .selectWhere("usuario", `username = '${decoded.payload}'`)
        .then((result) => {
          if (result.length > 0) {
            result = result[0];
            delete result.password;
            res.status(200).send({ valid: true, data: result });
          } else {
            res.status(401).send("Invalid token");
          }
        })
        .catch((err) => {
          res.status(500).send("Internal Server Error");
        });
    } catch (err) {
      res.status(401).send("Invalid token");
    }
  } else {
    res.status(400).send("Bad Request");
  }
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (validator.isInt(id, { min: 1, allow_leading_zeroes: false })) {
    bdHelper
      .selectWhere("usuario", `id = ${id}`)
      .then((result) => {
        if (result.length > 0) {
          result = result[0];
          delete result.password;
          delete result.email;
          delete result.num_pedidos;
          res.status(200).send(result);
        } else {
          res.status(404).send("User not found");
        }
      })
      .catch((err) => {
        res.status(500).send("Internal Server Error");
      });
  } else {
    res.status(400).send("Bad Request");
  }
});

module.exports = router;