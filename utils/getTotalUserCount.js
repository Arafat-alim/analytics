const Url = require("../models/Urls");

const getTotalUserCount = async () => {
  const entries = await Url.find({});

  const totalVisits = entries.reduce(
    (total, entry) => total + entry.visitedHistory.length,
    0
  );

  return totalVisits;
};

module.exports = { getTotalUserCount };
