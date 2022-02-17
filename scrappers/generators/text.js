module.exports.benefitsFormatter = function (benefits) {
  benefits.sort((a, b) => a.company.localeCompare(b.company));

  text = "";
  benefits.forEach((company) => {
    text += `*${company.company}*`;
    text += company.benefits.reduce(
      (prev, next) => prev + `\n - ${next.value}`, // (${next.type})`,
      ""
    );
    text += "\n\n";
  });
  return text.slice(0, 4096);
};
