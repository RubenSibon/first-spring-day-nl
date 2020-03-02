(function() {
  const $barchart = document.querySelector("#barchart");
  const $axisX = document.querySelector("#axisX");
  const $axisY = document.querySelector("#axisY");
  const $resultsLog = document.querySelector("#resultsLog");

  /**
    * Array with objects: one for each day from january 1931 up to january 2020.
    *
    * Each object is/should be formatted as follows:
    *
    * {
    *   "date": "1931-01-01",
    *
    *   // The third number refers to the Dutch "decade": a period of ten days (confusing? ¯\_(ツ)_/¯):
    *   "yearMonthTenDays": "1931m01d01",
    *
    *   // Maximum temperature in degrees Celsius of that day:
    *   "maxC": 5.8
    * },  
  **/
  const _tempsPerDay = data;

  /**
    * Get the number of days in a given month.
    *
    * @param {number} month - Month in MM format (use current month if undefined).
    * @param {number} year - Year in YYYY format (use current year if undefined).
    *
    * @returns {number}
  **/
  const daysInMonth = (year = (new Date().getFullYear()), month = (new Date().getMonth())) => {
    return new Date(year, month, 0).getDate();
  }

  /**
    * Extract the data of a year from a given dataset.
    *
    * @param {number} year - Year in YYYY format.
    * @param {Array} dataset
    *
    * @returns {Array}
  **/
  const dataOfYear = (year = (new Date().getFullYear()), dataset = _tempsPerDay) => {
    return dataset.filter(day => day.date.startsWith(year));
  };

  /**
    * Create object from array with dataset per year.
    *
    * @param {Function} fn - Get the data of a year.
    *
    * @returns {Object}
  **/
  const splitDatasetIntoYears = (fn = dataOfYear) => {
    let perYearObject = {};

    for (let year = 1931; year < 2020; year++) {
      perYearObject[`year${year}`] = {
        year,
        dataset: fn(year),
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
  const firstSpringDayForYear = (tempsInYear) => {
    const filtered = tempsInYear.filter(day => day.maxC >= 15);

    console.log(filtered);

    return filtered.length > 0 ? new Date(filtered[0].date) : "It was a very cold year... No days with temperatures above 15 degrees celsius! 0_o";
  };

  const firstSpringDayPerEachYear = (yearsObj) => {
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
  const logResult = (result) => {
    return `De eerste lentedag van ${result.getFullYear()} was ${result.toLocaleDateString("nl-NL")}`;
  };

  /**
    * Draw the graph and write the logs (side effects)
    *
    * @todo Break this monster function up...
  **/
  const drawResults = () => {
    const ZOOM_MULTIPLIER = 4;

    const lineStyles = { margin: "0 1px", width: "8px", height: 0 };
    const getFirstSpringDayPerYear = firstSpringDayPerEachYear(splitDatasetIntoYears(dataOfYear));

    let lineData = [];
    let axisYDays = 0;

    // Make and append a new bar for each data point.
    for (let index = 0; index < getFirstSpringDayPerYear.length; index++) {
      const firstSpringDay = getFirstSpringDayPerYear[index];

      const nodeLine = document.createElement("hr");
      const nodeYear = document.createElement("span");
      const nodeLog = document.createElement("p");

      const year = firstSpringDay.getFullYear();
      const month = firstSpringDay.getMonth();

      let value = 0;

      for (let index = month; index > 0; index--) {
        value = value + daysInMonth(year, index);
      }

      value = value + firstSpringDay.getDate();

      axisYDays = value >= axisYDays ? value + 10 : axisYDays;

      // Add the value of the bar to an array.
      lineData.push({ 
        year: firstSpringDay.getFullYear(),
        value,     
      });

      // Apply styling to bar.
      for (const style in lineStyles) {
        nodeLine.style[style] = lineStyles[style];
      }

      nodeLine.style.height = 0;
      nodeLine.setAttribute("title", value);
      nodeLine.setAttribute("data-year", lineData[index].year);

      setTimeout(() => {
        nodeLine.style.height = `${value * ZOOM_MULTIPLIER}px`;
      }, 500);

      const twoDigitYear = lineData[index].year - (lineData[index].year >= 2000 ? 2000 : 1900);
      nodeYear.innerHTML = `'${twoDigitYear}`;
      $axisX.appendChild(nodeYear);

      // Log result to page and console.
      nodeLog.innerHTML = logResult(firstSpringDay);
      $resultsLog.appendChild(nodeLog);
      console.log(logResult(firstSpringDay));

      // Add the bar to the chart.
      $barchart.appendChild(nodeLine);
    }

    $barchart.style.width = `${getFirstSpringDayPerYear.length}px;`;
    $barchart.style.opacity = 1;
    $barchart.style.setProperty("--barchart-height", `${axisYDays * ZOOM_MULTIPLIER}px`);

    $axisY.innerHTML = `<div>${axisYDays}</div> <div>0</div>`;
  };

  drawResults();

  $barchart.addEventListener("mouseover", ({ target }) => {
    if (target && target.title) {
      console.log(`${target.dataset.year}: ${target.title}`);
    }
  });
}());
