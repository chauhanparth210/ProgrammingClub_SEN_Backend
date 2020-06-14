const jwt = require("jsonwebtoken");
require("dotenv").config();

const checkPCConvener = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.isPCConvener === true) {
      req.user = decoded;
      next();
    } else {
      throw new Error("You don't have access...");
    }
  } catch (err) {
    return res.status(401).json({
      message: "Auth failed"
    });
  }
};

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Auth failed"
    });
  }
};

const checkPCMember = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.isPCMember === true) {
      req.user = decoded;
      next();
    } else {
      throw new Error("You don't have access...");
    }
  } catch (err) {
    return res.status(401).json({
      message: "Auth failed"
    });
  }
};

module.exports = {
  checkAuth,
  checkPCConvener,
  checkPCMember
};
