const axios = require("axios");

const getUserIp = async () => {
  try {
    const response = await axios.get("https://api.ipify.org/?format=json");
    return response.data.ip;
  } catch (err) {
    console.error(
      "Something went wrong while fetching the user IP address:",
      err.message
    );
    throw new Error("Failed to fetch user IP");
  }
};

module.exports = { getUserIp };
