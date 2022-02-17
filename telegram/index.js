require("dotenv").config();

const scrapperSantander = require("../scrappers/cl/santander/index");
const formatter = require("../scrappers/generators/text");
const TelegramBot = require("node-telegram-bot-api");

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

async function responseMessage() {
  const response = await scrapperSantander.scrapperSantander();
  return formatter.benefitsFormatter(response);
}

// Matches "/echo [whatever]"
bot.onText(/\/update/, async (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(process.env.TELEGRAM_CHANNEL, await responseMessage(), {
    parse_mode: "Markdown",
  });
});

// Listen for any kind of message. There are different kinds of
// messages.
// bot.on("message", async (msg) => {
//   const chatId = msg.chat.id;
//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(
//     parseInt(process.env.TELEGRAM_CHANNEL),
//     await responseMessage(),
//     {
//       parse_mode: "Markdown",
//     }
//   );
// });
