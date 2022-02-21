module.exports.parseFilters = function (filterText) {
  filterText = filterText.toLowerCase().trim();
  if (filterText === "all" || filterText === "") {
    return [];
  }
  return filterText.split(",").map((text) => text.trim());
};

module.exports.benefitsFilters = function (benefits, filters = []) {
  // we remove all the non specified benefits type
  benefits.forEach((company) => {
    // if no specification is given, then we return all the benefits
    if (filters.length === 0) {
      return;
    }

    // filter by specified and allowed filter type
    company.benefits = company.benefits.filter((benefit) =>
      filters.includes(benefit.type)
    );
  });
  // return non empty companies
  return benefits.filter((company) => company.benefits.length !== 0);
};
