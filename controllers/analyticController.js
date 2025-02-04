const Url = require("../models/Urls");

exports.getAllDataAnalytics = async (req, res) => {
  try {
    const entries = await Url.find({});

    // Calculate the total number of unique users (based on clientIp)
    const uniqueUsers = new Set(entries.map((entry) => entry.clientIp)).size;
    return res.status(200).json({
      success: true,
      message: "Data fetched",
      uniqueUsers,
      data: entries,
    });
  } catch (err) {
    console.error(
      "something went wrong while fetching the get all analytics data",
      err
    );
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.handleUserCount = async (req, res) => {
  try {
    // Fetch all entries from the database
    const entries = await Url.find({});

    // Log the fetched data for debugging purposes
    console.log("Fetched entries:", entries);

    // Calculate the total number of visits across all users
    const totalVisits = entries.reduce(
      (total, entry) => total + entry.visitedHistory.length,
      0
    );

    // Return the response
    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      totalVisits: totalVisits,
    });
  } catch (err) {
    // Log the error for debugging purposes
    console.error(
      "Something went wrong while fetching user count:",
      err.message
    );

    // Return an error response
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
