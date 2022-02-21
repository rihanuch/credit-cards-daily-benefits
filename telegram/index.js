require("dotenv").config();

const scrapperSantander = require("../scrappers/cl/santander/index");
const formatter = require("../scrappers/generators/text");
const filterers = require("../scrappers/generators/filters");
const TelegramBot = require("node-telegram-bot-api");

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

async function responseMessage({ data = null, filters = [] }) {
  let response = data ? data : await scrapperSantander.scrapper();
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
    bot.sendMessage(process.env.TELEGRAM_CHANNEL, message, {
      parse_mode: "Markdown",
    });
  }
});
