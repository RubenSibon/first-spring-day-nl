/**
 * Get the number of days in a given month.
 *
 * @param {number} month - Month in MM format (use current month if undefined).
 * @param {number} year - Year in YYYY format (use current year if undefined).
 *
 * @returns {number}
**/
export const daysInMonth = (year = (new Date().getFullYear()), month = (new Date().getMonth())) => {
  return new Date(year, month, 0).getDate();
}

/**
 * Extract the data of a year from a given dataset.
 *
 * @param {Array} dataset
 * @param {number} year - Year in YYYY format.
 *
 * @returns {Array}
**/
export const dataOfYear = (dataset, year = (new Date().getFullYear())) => {
  try {
    if (dataset) {
      return dataset.filter(day => day.date.startsWith(year));
    }
  } catch (error) {
    const msg = "There is no dataset to work on.";

    console.error(msg);
    console.error(error);

    alert(msg);
  }
};

/**
 * Create object from array with dataset per year.
 *
 * @param {Function} fn - Get the data of a year.
 * @param {Array} dataset
 *
 * @returns {Object}
**/
export const splitDatasetIntoYears = (fn = dataOfYear, dataset) => {
  let perYearObject = {};

  /**
   * @todo Could I use a reducer here with `Object.assign()`? Maybe, but how? 🤔
  **/
  for (let year = 1931; year < 2020; year++) {
    perYearObject[`year${year}`] = {
      year,
      dataset: fn(dataset, year),
    };
  }

  return perYearObject;
};

/**
 * Get the first spring day.
 *
 * @param {Array} dataset
 *
 * @returns {Date|string} Date of first spring day or a string if it was an unusually cold year (improbable).
**/
export const firstSpringDayForYear = (tempsInYear) => {
  const filtered = tempsInYear.filter(day => day.maxC >= 15);

  return filtered.length > 0 ? new Date(filtered[0].date) : "It was a very cold year... No days with temperatures above 15 degrees celsius! 0_o";
};

/**
 * Get the first spring day of each year in an array.
 *
 * @param {Object} yearsObj - The raw data with all years
 *
 * @returns {Array}
**/
export const firstSpringDayPerEachYear = (yearsObj) => {
  return Object.values(yearsObj).map(({ dataset }) => {
    return firstSpringDayForYear(dataset);
  });
};


/**
 * Log the result in a Dutch sentence.
 *
 * @param {Date} result - Date of the first spring day.
 *
 * @returns {string}
**/
export const logResult = (result) => {
  return `De eerste lentedag van ${result.getFullYear()} was ${result.toLocaleDateString("nl-NL")}`;
};