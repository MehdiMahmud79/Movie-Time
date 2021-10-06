const router = require("express").Router();
const { Movie, LikedMovie, Comment, User } = require("../../models");
const withAuth = require("../../utils/auth");
const bcrypt = require("bcrypt");
console.log("\n bcrypt\n", bcrypt);
// creat /register a new user
router.post("/", async (req, res) => {
  try {
    const userToCheck = await User.findOne({
      where: { email: req.body.email },
    });

    if (userToCheck) {
      res.status(400).json({
        message: `Error: Email: ${req.body.email} is registered already!`,
      });
      return;
    }
    const userData = await User.create(req.body);
    req.flash(
      "msg",
      `Hello ${userData.userName}, You registered successfully!`
    );

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      req.session.userName = userData.userName;
      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
      return;
    }
    req.flash("msg", `Hello ${userData.userName}, You Logged in successfully!`);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.userName = userData.userName;
      req.session.email = userData.email;
      req.session.logged_in = true;

      res.json({ user: userData, message: "You are now logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/update", withAuth, async (req, res) => {
  const optionsToUpdate = {
    userName: req.body.userName,
    password: req.body.newPassword,
    email: req.body.email,
  };
  try {
    const userData = await User.findOne({
      where: { email: req.body.email },
    });

    if (!userData) {
      res.status(400).json({
        message: "Incorrect User Name, Email or Password. Please try again",
      });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect Email or Password. Please try again" });
      return;
    }
    console.log("\n user options to update\n", optionsToUpdate);
    const updatedUser = await User.update(
      {
        ...optionsToUpdate,
      },

      {
        where: {
          id: userData.id,
        },
      },
      {
        individualHooks: true,
        returning: true,
      }
    );
    res.status(200).json({ message: "user updated" });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/logout", (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
