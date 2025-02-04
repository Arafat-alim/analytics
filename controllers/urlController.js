const requestIp = require("request-ip");
const Url = require("../models/Urls");
const geoIp = require("geoip-lite");
const { getUserIp } = require("../utils/getUserIp");
const { getTotalUserCount } = require("../utils/getTotalUserCount");
const { sendUserDataToDiscord } = require("../utils/sendUserDataToDiscord");

exports.handlePost = async (req, res) => {
  try {
    // Extract client IP from the request body or headers
    const { ipClient } = req.body;
    const ipDomain = await getUserIp();
    const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK || null;

    if (!ipClient && !ipDomain) {
      return res.status(400).json({
        success: false,
        message: "Client IP is required",
      });
    }

    let totalVIsitors;

    //! Update Final Ip
    const ipFinal = ipDomain || ipClient;

    // Get server IP using the request-ip library
    const ipServer = requestIp.getClientIp(req);

    // Fetch geolocation details for the client IP
    const fetchedIp =
      ipServer === "::1" ? ipFinal : ipServer ? ipServer : ipFinal;

    const geo = geoIp.lookup(fetchedIp);

    // Prepare the new visit record
    const newVisit = {
      timestamp: new Date(),
      serverIp: ipServer,
      osType: req.useragent?.os || "Unknown",
      deviceType: req.useragent?.isMobile ? "mobile" : "desktop",
      platform: req.useragent?.platform || "Unknown",
      browser: req.useragent?.browser || "Unknown",
      country: geo?.country || null,
      region: geo?.region || null,
      city: geo?.city || null,
    };

    // Check if data already exists for the given client IP
    const oldData = await Url.findOne({ clientIp: fetchedIp });

    if (oldData) {
      // If old data exists, update the visitedHistory array with the new visit record
      oldData.visitedHistory.push(newVisit);
      const updatedData = await oldData.save();

      totalVIsitors = await getTotalUserCount();
      //! send data to webhook
      await sendUserDataToDiscord({
        webhookUrl: DISCORD_WEBHOOK_URL,
        totalVIsitors,
        visitedData: newVisit,
        cardColor: "3851519",
        message: "Visitor visited again, data updated",
        header:
          "🔥 Power Level Restored! A Saiyan Has Returned to Arafat’s Battlefield!",
      });

      return res.status(200).json({
        success: true,
        message: "Visited history updated successfully",
        visitors: totalVIsitors,
      });
    }

    // If no old data exists, create a new document
    const data = new Url({
      clientIp: fetchedIp,
      userAgent: req.headers["user-agent"],
      visitedHistory: [newVisit],
    });

    const savedData = await data.save();

    if (!savedData) {
      console.error("Something went wrong while saving new data");
      totalVIsitors = await getTotalUserCount();
      await sendUserDataToDiscord({
        webhookUrl: DISCORD_WEBHOOK_URL,
        totalVIsitors,
        cardColor: "15158332",
        message: "System Failure to store data",
        header:
          "⚠️ Uh-oh! A Wild Error Appeared! Arafat Tech Support is on the Case!",
      });
      return res.status(500).json({
        success: false,
        message: "Failed to save data",
        visitors: totalVIsitors,
      });
    }

    totalVIsitors = await getTotalUserCount();

    //! send data to webhook
    await sendUserDataToDiscord({
      webhookUrl: DISCORD_WEBHOOK_URL,
      totalVIsitors,
      visitedData: newVisit,
      cardColor: "65280",
      message: "New User came into your home.",
      header: "🧠 Curiosity Awakens! A Genius Mind Has Entered Arafat’s Lab!",
    });

    // Return success response
    return res.status(201).json({
      success: true,
      message: "New data added successfully",
      visitors: totalVIsitors,
    });
  } catch (err) {
    console.error("Something went wrong while posting new data:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

exports.handlePreciseLocation = async (req, res) => {
  try {
    const { clientIp, preciseLocation } = req.body;
    if (!clientIp) {
      return res.status(403).json({
        success: false,
        message: "Client Ip is empty",
      });
    } else if (!preciseLocation || !Object.keys(preciseLocation).length) {
      return res.status(403).json({
        success: false,
        message: "Precise location is empty",
      });
    }
    const newLocation = {
      coords: {
        timestamp: new Date(),
        latitude: preciseLocation.coords.latitude || null,
        longitude: preciseLocation.coords.longitude || null,
        altitude: preciseLocation.coords.altitude || null,
        accuracy: preciseLocation.coords.accuracy || null,
        altitudeAccuracy: preciseLocation.coords.altitudeAccuracy || null,
        heading: preciseLocation.coords.heading || null,
        speed: preciseLocation.coords.speed || null,
      },
    };

    const oldData = await Url.findOne({ clientIp: clientIp });

    if (oldData) {
      oldData.preciseLocation.push(newLocation);
      const updatedData = await oldData.save();
      //   console.log("Old data found and updated: ", updatedData);

      return res.status(201).json({
        success: true,
        message: "Precise location updated successfully",
        data: updatedData,
      });
    }
    return res.status(404).json({
      success: false,
      message: "Old Data not found",
    });
  } catch (err) {
    console.error(
      "something went wrong with handle Previous location api: ",
      err
    );
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
