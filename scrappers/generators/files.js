const fs = require("fs");

module.exports.loadOrScrape = async function (path, method) {
  try {
    if (fs.existsSync(path)) {
      return JSON.parse(fs.readFileSync(path));
    } else {
      const data = await method();
      await fs.writeFileSync(path, JSON.stringify(data));
      return data;
    }
  } catch (err) {
    console.error(err);
  }
};
