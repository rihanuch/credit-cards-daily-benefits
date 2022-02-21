const KEY_EXPIRATION_TIME_SECONDS = 60 * 60 * 24;

module.exports.loadOrScrape = async function (bank, method, client) {
  const exists = await client.exists(bank);
  if (exists) {
    console.log(`key: '${bank}' exists: fetching from redis`);
    const data = JSON.parse(await client.get(bank));
    return data;
  } else {
    console.log(`key: '${bank}' does not exists: fetching from url`);
    const data = await method();
    await client.set(bank, JSON.stringify(data), {
      EX: KEY_EXPIRATION_TIME_SECONDS,
    });
    return data;
  }
};
