import getWeatherData from "./dataHandling.js";
import { daysInMonth, dataOfYear, splitDatasetIntoYears, firstSpringDayForYear, firstSpringDayPerEachYear, logResult } from "./firstSpringDay.js";

/**
 * @todo Considering to refactor this render module into a OOP Class.
**/

// Constants
const ZOOM_MULTIPLIER = 4;
const BAR_STYLES = { margin: "0 1px", width: "8px", height: 0 };

// Selected elements
const $axisX = document.querySelector("#axisX");

let tempsPerDay;
let getFirstSpringDayPerYear;

/**
 * Virtually render x-axis labels
**/
function virtualXAxisLabels (barData, index) {
  const nodeYear = document.createElement("span");
  const twoDigitYear = barData[index].year - (barData[index].year >= 2000 ? 2000 : 1900);

  nodeYear.innerHTML = `'${twoDigitYear}`;

  return nodeYear;
};

/**
 * Render x-axis
**/
function xAxisRender (labels) {
  $axisX.append(...labels);
};

/**
 * Render y-axis
**/
function yAxis (length) {
  const $axisY = document.querySelector("#axisY");

  $axisY.innerHTML = `<div>${length}</div> <div>0</div>`;
};

/**
 * Virtually render a bar
**/
function virtualBar (barValue, barYear, nth) {
  function removeTransitionDelay () {
    nodeBar.style.transitionDelay = "0ms";

    nodeBar.removeEventListener("transitionend", removeTransitionDelay);
  }

  const nodeBar = document.createElement("hr");

  for (const style in BAR_STYLES) {
    nodeBar.style[style] = BAR_STYLES[style];
  }

  nodeBar.style.height = 0;
  nodeBar.style.transitionDelay = `${nth * 10}ms`;
  nodeBar.setAttribute("title", barValue);
  nodeBar.setAttribute("data-year", barYear);

  setTimeout(() => {
    nodeBar.style.height = `${barValue * ZOOM_MULTIPLIER}px`;
  }, 0);

  nodeBar.addEventListener("transitionend", removeTransitionDelay);

  return nodeBar;
};

/**
 * Render barchart
**/
function barchartRender (bars, axisYLength) {
  const $barchart = document.querySelector("#barchart");

  $barchart.style.width = `${getFirstSpringDayPerYear.length}px;`;
  $barchart.style.opacity = 1;
  $barchart.style.setProperty("--barchart-height", `${axisYLength * ZOOM_MULTIPLIER}px`);

  yAxis(axisYLength);

  $barchart.append(...bars);

  barchartInteractivity($barchart);
};

/**
 * Attach barchart interactivity
**/
function barchartInteractivity ($element) {
  $element.addEventListener("mouseover", ({ target }) => {
    if (target && target.title) {
      console.log(`${target.dataset.year}: ${target.title}`);
    }
  });
};

/**
 * Render table
**/
// @todo Create table with data ("Number of days since January 1st" and "Date of first spring day" in two columns)
// const nodeTable = document.createElement("table");
// const nodeThead = document.createElement("thead");
// const nodeTh = document.createElement("th");
// const nodeTh1 = nodeTh;
// const nodeTh2 = nodeTh;
// const nodeTr = document.createElement("tr");

// nodeTh1.innerHTML = "DAGEN T/M";
// nodeTh1.innerHTML = "DATUM";
// nodeThead.innerHTML = nodeTh;
// nodeTable.innerHTML = nodeThead;

/**
 * Attach table interactivity
**/

/**
 * Draw the graph and write the logs (side effects)
 *
 * @todo Break this monster function up...
**/
function drawResults () {
  const $resultsLog = document.querySelector("#resultsLog");

  const barData = [];
  const nodeBars = [];
  const xAxisLabels = [];

  let axisYDays = 0;

  // Make and append a new bar for each data point.
  for (let index = 0; index < getFirstSpringDayPerYear.length; index++) {
    const firstSpringDay = getFirstSpringDayPerYear[index];

    const year = firstSpringDay.getFullYear();
    const month = firstSpringDay.getMonth();

    let value = 0;
    let nodeBar;

    for (let index = month; index > 0; index--) {
      value = value + daysInMonth(year, index);
    }

    value = value + firstSpringDay.getDate();

    axisYDays = value >= axisYDays ? value + 10 : axisYDays;

    // Add the value of the bar to an array.
    barData.push({ 
      year,
      value,
    });

    // Log result to page in a table.
    const nodeLog = document.createElement("p");
    nodeLog.innerHTML = logResult(firstSpringDay);

    const nodeDataTd = document.createElement("td");
    nodeDataTd.innerHTML = `${value}, ${firstSpringDay.toLocaleDateString("nl-NL")}`;
    $resultsLog.appendChild(nodeLog);
    $resultsLog.appendChild(nodeDataTd);

    nodeBar = virtualBar(value, barData[index].year, index);

    // Add the bar to the chart.
    xAxisLabels.push(virtualXAxisLabels(barData, index));
    nodeBars.push(nodeBar);

  }

  xAxisRender(xAxisLabels);
  barchartRender(nodeBars, axisYDays);
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
  /**
   * Set the data (temperatures per day).
  **/
  tempsPerDay = data;

  /**
   * Curry together the first spring day per year.
  **/
  getFirstSpringDayPerYear = firstSpringDayPerEachYear(splitDatasetIntoYears(dataOfYear, tempsPerDay));

  drawResults();
});
