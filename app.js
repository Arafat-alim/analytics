require("dotenv").config();
const express = require("express");
const cors = require("cors");
const urlRoutes = require("./routes/urlRoutes");
const helmet = require("helmet");
const useragent = require("express-useragent");
const { connectDB } = require("./config/db");
const limiter = require("./middlewares/rateLimit");
const analyticRoutes = require("./routes/analyticsRoutes");
const app = express();

//! Enable trust proxy to properly handle client IPs behind proxies
app.set("trust proxy", true);

// ! mongo db connection
connectDB();

//! middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(useragent.express());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is Live",
  });
});

app.use("/api/", limiter);
//! routers
app.use("/api/v1/url", urlRoutes);
app.use("/api/v1/analytic", analyticRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
