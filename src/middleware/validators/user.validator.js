const { body } = require("express-validator");

exports.validateEnquiry = [
  body("name")
    .exists()
    .withMessage("Name is required"),
  body("password")
    .exists()
    .withMessage("Password is required"),
];