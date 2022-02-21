const puppeteer = require("puppeteer");
const generators = require("../../generators/format.js");
const fileHandler = require("../../generators/files");

module.exports.scrapper = async function () {
  const data = await fileHandler.loadOrScrape(
    "scrappers/cl/santander/data.json",
    scrape
  );
  return data;
};

async function scrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://banco.santander.cl/beneficios?segmento=s-personas");

  const data = await page.$$eval(".content-up", (nodes) => {
    return nodes.map((node) => {
      let children = Array.from(node.children);
      children = children.filter(
        (child) => child.tagName === "H2" || child.tagName === "P"
      );
      return {
        company: children[0].textContent.trim(),
        benefit: children[1].textContent.trim(),
      };
    });
  });
  await browser.close();

  const result = [...new Set(data.map((el) => el.company))].map((company) =>
    generators.companyBenefitGenerator({ company: company })
  );

  for (const company of result) {
    const name = company.company;
    const originalLines = data
      .filter((el) => el.company === name)
      .map((el) => el.benefit);

    company.originalLines = originalLines;
    company.benefits = originalLines
      .map((el) => generators.generateBenefitsFromLine(el))
      .flat()
      .map((el) => generators.benefitGenerator(el));
  }

  return result;
}
