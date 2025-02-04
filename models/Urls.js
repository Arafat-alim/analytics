const mongoose = require("mongoose");

const urlSchema = mongoose.Schema(
  {
    clientIp: { type: String, required: true },
    userAgent: { type: String },
    visitedHistory: [
      {
        timestamp: { type: Date },
        serverIp: { type: String, required: true },
        osType: { type: String },
        deviceType: { type: String },
        platform: { type: String },
        browser: { type: String },
        country: { type: String },
        region: { type: String },
        city: { type: String },
      },
    ],
    preciseLocation: [
      {
        coords: {
          latitude: { type: String }, // Latitude of the location
          longitude: { type: String }, // Longitude of the location
          altitude: { type: String }, // Altitude of the location
          accuracy: { type: String }, // Accuracy of the location data
          altitudeAccuracy: { type: String }, // Altitude accuracy
          heading: { type: String }, // Heading (direction of movement)
          speed: { type: String }, // Speed of movement
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
