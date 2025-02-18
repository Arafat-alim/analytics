const express = require("express");
const {
  handlePost,
  handlePreciseLocation,
} = require("../controllers/urlController");

const urlRouter = express.Router();

urlRouter.post("/post", handlePost);
urlRouter.put("/update", handlePreciseLocation);

module.exports = urlRouter;
