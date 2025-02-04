const axios = require("axios");

const sendUserDataToDiscord = async ({
  webhookUrl,
  visitedData,
  totalVIsitors,
  message,
  cardColor,
  header,
}) => {
  try {
    console.log("Called__");
    const newVisit = {
      ...visitedData,
      totalVIsitors,
      message,
    };

    console.log(newVisit);
    const prettifiedMessage = `\`\`\`json\n${JSON.stringify(
      newVisit,
      null,
      2
    )}\n\`\`\``;
    const mySite =
      process.env.REACT_APP_PORTFOLIO_WEBSITE || "Arafat Portfolio";

    if (!webhookUrl) {
      console.error("Webhook URL is missing.");
      return;
    }

    await axios.post(
      webhookUrl,
      {
        embeds: [
          {
            title: `${header || "New Visit"} >> ${mySite}`,
            description: prettifiedMessage,
            color: cardColor || "3447003",
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error while sending user data to Discord:", error);
  }
};

module.exports = { sendUserDataToDiscord };
