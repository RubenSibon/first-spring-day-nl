import getWeatherData from "./dataHandling.js";
import { daysInMonth, dataOfYear, splitDatasetIntoYears, firstSpringDayForYear, firstSpringDayPerEachYear, logResult } from "./firstSpringDay.js";

let tempsPerDay;

/**
 * Draw the graph and write the logs (side effects)
 *
 * @todo Break this monster function up...
**/
const drawResults = () => {
  const ZOOM_MULTIPLIER = 4;

  const $barchart = document.querySelector("#barchart");
  const $axisX = document.querySelector("#axisX");
  const $axisY = document.querySelector("#axisY");
  const $resultsLog = document.querySelector("#resultsLog");

  const lineStyles = { margin: "0 1px", width: "8px", height: 0 };
  const getFirstSpringDayPerYear = firstSpringDayPerEachYear(splitDatasetIntoYears(dataOfYear, tempsPerDay));

  // @todo Create table with data ("Number of days since January 1st" and "Date of first spring day" in two columns)
  // const nodeTable = document.createElement("table");
  // const nodeThead = document.createElement("thead");
  // const nodeTh = document.createElement("th");
  // const nodeTh1 = nodeTh;
  // const nodeTh2 = nodeTh;

  let lineData = [];
  let axisYDays = 0;

  // nodeTh1.innerHTML = "DAGEN T/M";
  // nodeTh1.innerHTML = "DATUM";
  // nodeThead.innerHTML = nodeTh;
  // nodeTable.innerHTML = nodeThead;

  // Make and append a new bar for each data point.
  for (let index = 0; index < getFirstSpringDayPerYear.length; index++) {
    const firstSpringDay = getFirstSpringDayPerYear[index];

    const nodeLine = document.createElement("hr");
    const nodeYear = document.createElement("span");
    const nodeLog = document.createElement("p");
    const nodeTr = document.createElement("tr");
    const nodeDataTd = document.createElement("td");

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

    // Log result to page.
    nodeLog.innerHTML = logResult(firstSpringDay);
    nodeDataTd.innerHTML = `${value}, ${firstSpringDay.toLocaleDateString("nl-NL")}`;
    $resultsLog.appendChild(nodeLog);
    $resultsLog.appendChild(nodeDataTd);

    // Add the bar to the chart.
    $barchart.appendChild(nodeLine);
  }

  $barchart.style.width = `${getFirstSpringDayPerYear.length}px;`;
  $barchart.style.opacity = 1;
  $barchart.style.setProperty("--barchart-height", `${axisYDays * ZOOM_MULTIPLIER}px`);

  $axisY.innerHTML = `<div>${axisYDays}</div> <div>0</div>`;

  $barchart.addEventListener("mouseover", ({ target }) => {
    if (target && target.title) {
      console.log(`${target.dataset.year}: ${target.title}`);
    }
  });
};

/**
 * Initialize render after getting the dataset.
**/
(async function() {
  try {
    const weatherData = await getWeatherData();

    return weatherData;
  } catch (error) {
    console.error(error);
    alert("An unknown problem occured. ¯\_(ツ)_/¯ Please try again by reloading the page.");
  }
})().then(data => {
  tempsPerDay = data;

  drawResults();
});
