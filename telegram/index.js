require("dotenv").config();

const scrapperSantander = require("../scrappers/cl/santander/index");
const formatter = require("../scrappers/generators/text");
const filterers = require("../scrappers/generators/filters");
const TelegramBot = require("node-telegram-bot-api");

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

async function responseMessage({ filters = [] }) {
  let response = await scrapperSantander.scrapper(client);
  responses = filterers.benefitsFilters(response, filters);
  const messages = formatter.benefitsFormatter(response);
  return messages;
}

bot.onText(/\/get/, async (msg, match) => {
  const opts = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Santander",
            callback_data: "santander",
          },
          // {
          //   text: "Banco de Chile",
          //   callback_data: "bancoDeChile",
          // },
        ],
      ],
    },
  };
  bot.sendMessage(msg.from.id, "Select a bank", opts);
});

// Handle callback queries
bot.on("callback_query", function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  let text;

  console.log(callbackQuery);
});

// Matches "/echo [whatever]"
bot.onText(/\/get (?<bank>\w+)(?<filter>.*)/, async (msg, match) => {
  // unload the matches form the regex match
  const {
    groups: { bank, filter },
  } = match;

  const parsedFilters = filterers.parseFilters(filter);

  // const chatId = msg.chat.id;
  // const resp = match[1]; // the captured "whatever"
  const messages = await responseMessage({ filters: parsedFilters });

  for (let message of messages) {
    message =
      message === ""
        ? `No data found for specified query \`\`\`/get ${msg.text}\`\`\``
        : message;
    bot.sendMessage(msg.chat.id, message, {
      parse_mode: "Markdown",
    });
  }
});

module.exports.telegramBot = bot;
