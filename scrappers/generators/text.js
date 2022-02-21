const MAXIMUM_MSG_LEN = 4096;

module.exports.benefitsFormatter = function (benefits) {
  benefits.sort((a, b) => a.company.localeCompare(b.company));

  const payload = [];
  let currentText = "";
  benefits.forEach((company) => {
    if (company.benefits.length === 0) {
      return;
    }
    const text = companyToString(company);
    currentText = splitIntoMultiple(currentText, text, payload);
  });
  payload.push(currentText);
  return payload;
};

function companyToString(company) {
  let text = `*${company.company}*`;
  text += company.benefits.reduce(
    (prev, next) => prev + `\n - ${next.value}`,
    ""
  );
  text += "\n\n";
  return text;
}

function splitIntoMultiple(currentText, text, payload) {
  if (currentText.length + text.length > MAXIMUM_MSG_LEN) {
    payload.push(currentText);
    currentText = text;
  } else {
    currentText += text;
  }
  return currentText;
}
