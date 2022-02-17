const quotaRegex = /cuotas/;
const discountRegex = /\d+% dcto/;
const milesRegex = /x\d+/;

function detectTypeValue(line) {
  if (quotaRegex.test(line)) {
    return "quota";
  }
  if (discountRegex.test(line)) {
    return "discount";
  }
  if (milesRegex.test(line)) {
    return "miles";
  } else {
    return "other";
  }
}

module.exports.companyBenefitGenerator = function ({ company = "" }) {
  return {
    company: company,
    benefits: [],
    originalLines: [],
  };
};

module.exports.generateBenefitsFromLine = function (line) {
  return line.split(/ , | y /);
};

module.exports.benefitGenerator = function (value) {
  return {
    type: detectTypeValue(value),
    value: value,
  };
};
