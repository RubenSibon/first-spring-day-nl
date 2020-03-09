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
export default async function getWeatherData() {
  axios.defaults.baseURL = 'https://knmi-daggegevens-temp.firebaseio.com/tempData.json';

  try {
    const response = await axios.get('');

    return response.data;
  } catch (error) {
    console.error(error);
    alert("An unknown problem occured. Please try again by reloading the page.");
  }
}
