require("dotenv").config();

const scrapperSantander = require("../scrappers/cl/santander/index");
const formatter = require("../scrappers/generators/text");
const filterers = require("../scrappers/generators/filters");
const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const redis = require("redis");
const app = express();

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });
const client = redis.createClient();

async function responseMessage({ data = null, filters = [] }) {
  let response = data ? data : await scrapperSantander.scrapper(client);
  responses = filterers.benefitsFilters(response, filters);
  const messages = formatter.benefitsFormatter(response);
  return messages;
}

// Matches "/echo [whatever]"
bot.onText(/\/get (?<bank>\w+)(?<filter>.*)/, async (msg, match) => {
  // unload the matches form the regex match
  const {
    groups: { bank, filter },
  } = match;

  const parsedFilters = filterers.parseFilters(filter);

  // const chatId = msg.chat.id;
  // const resp = match[1]; // the captured "whatever"
  const messages = await responseMessage({
    // data: jsonData(),
    filters: parsedFilters,
  });

  for (const message of messages) {
    const mssg = message === "" ? "empty" : message;
    bot.sendMessage(process.env.TELEGRAM_CHANNEL, mssg, {
      parse_mode: "Markdown",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async function () {
  await client.connect({
    url: process.env.REDIS_URL
      ? process.env.REDIS_URL
      : "redis://localhost:6379",
  });
  console.log(`Server is running at port ${PORT}`);
});
