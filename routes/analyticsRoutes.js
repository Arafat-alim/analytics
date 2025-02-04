const express = require("express");
const {
  getAllDataAnalytics,
  handleUserCount,
} = require("../controllers/analyticController");

const analyticRouter = express.Router();

analyticRouter.get("/data", getAllDataAnalytics);
analyticRouter.get("/user-count", handleUserCount);

module.exports = analyticRouter;
