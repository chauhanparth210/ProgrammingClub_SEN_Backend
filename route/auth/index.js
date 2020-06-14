const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../../models/user");

const { checkPCConvener } = require("../../middleware/checkAuthenticity");

const {
  sendConfirmationMail,
  sendPasswordResetMail,
} = require("../../utils/sendEmail");

const saltRounds = 10;

const signIn = (req, res) => {
  User.findOne({ studentID: req.body.studentID })
    .select("-__v")
    .exec((error, user) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Database query Failed!.." });
      } else if (user === null)
        return res.status(404).json({ message: "User does not exist!.." });
      else if (user.isStudentVerified === false)
        return res
          .status(500)
          .json({ message: "Email Confirmation Pending...." });
      else {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            return res.status(500).json({ message: "Auth failed!.." });
          }
          if (result) {
            const { studentID, name, isPCMember, isPCConvener, _id } = user;
            let flagPCConvener = false;

            if (isPCConvener) {
              flagPCConvener = true;
            }

            const token = jwt.sign(
              {
                studentID,
                isPCMember,
                isPCConvener: flagPCConvener,
              },
              process.env.SECRET_KEY,
              { expiresIn: "5h" }
            );
            return res.status(201).json({
              message: "Successful Authentication.",
              token,
              user: {
                studentID,
                name,
                isPCMember,
                id: _id,
              },
            });
          } else res.status(500).json({ message: "Incorrect Password!.." });
        });
      }
    });
};

const studentVerification = (req, res) => {
  const user = jwt.verify(req.params.token, process.env.SECRET_KEY);
  const { studentID } = user;
  User.update({ studentID }, { isStudentVerified: true }, (err) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error. Could not verify user!.." });
    } else res.redirect(process.env.LOGIN_PAGE);
  });
};

const signUp = (req, res) => {
  const { studentID, password, name } = req.body;
  User.findOne({ studentID }).exec((error, user) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: "Database query Failed!.." });
    } else if (user === null) {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, (err, hash) => {
          User.create(
            {
              studentID,
              name,
              password: hash,
            },
            (error) => {
              if (error) {
                return res.status(500).json({
                  message: "Database error.Failed to create a user!..",
                });
              } else {
                sendConfirmationMail(studentID);
                return res
                  .status(201)
                  .json({ message: "New user created Successfully." });
              }
            }
          );
        });
      });
    } else {
      return res.status(500).json({ message: "User is already exist!.." });
    }
  });
};

const sendPasswordResetLink = (req, res) => {
  const { studentID } = req.body;
  User.findOne({ studentID })
    .then((data) => {
      if (data) {
        sendPasswordResetMail(studentID);
        return res.status(201).json({ message: "Plaese check your email!." });
      } else {
        throw new Error("Database Error...");
      }
    })
    .catch((err) => {
      return res.status(500).json({ message: "User is not exist!..." });
    });
};

const resetPassword = (req, res) => {
  const { password } = req.body;
  const user = jwt.verify(req.params.token, process.env.SECRET_KEY);
  const { studentID } = user;
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, (err, hash) => {
      User.findOneAndUpdate({ studentID }, { password: hash })
        .then((user) => {
          res
            .status(201)
            .json({ message: "Password is changed Successfully." });
        })
        .catch((err) => {
          res.status(500).json({ message: "Password is not changed!.." });
        });
    });
  });
};

const getAccounts = (req, res) => {
  User.find({ isSupervisor: false })
    .select("-__v -_id -password -isStudentVerified")
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(500).json({ message: "Database query failed!..." });
    });
};

const changeRoleAsPCMember = (req, res) => {
  const { studentID } = req.body;
  User.findOneAndUpdate(
    { studentID },
    {
      $set: {
        isPCMember: true,
      },
    }
  )
    .then((result) => {
      res.status(201).json({ message: "Change Role to HMC Convener." });
    })
    .catch((err) => {
      res.status(500).json({ message: "Database query failed!..." });
    });
};

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/reset-password", sendPasswordResetLink);
router.post("/reset-password/:token", resetPassword);
router.get("/get-users", checkPCConvener, getAccounts);
router.post("/change-role", checkPCConvener, changeRoleAsPCMember);
router.get("/token/:token", studentVerification);

module.exports = router;
