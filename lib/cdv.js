import * as ChartUtil from './chart_util';
import * as CarListUtil from './carlist_util';

function carData() {
  const baseUrl = "https://www.carqueryapi.com/api/0.3/";
  // call to Carquery API
  $.getJSON(baseUrl+"?callback=?", {cmd:"getTrims", min_power:400, min_top_speed: 10, min_torque: 10, min_weight:10 }, (data) => {
    const carList = data.Trims;
    // full car list array of objects
    // console.log(carList);
    // radar chat array of car objects
    let carScoreArr = CarListUtil.radarScores(carList);
    // test radar chart
    ChartUtil.makeSpiderChart(carScoreArr[0],carScoreArr[1]);
    // hash containing manufacture and model count
    let carMakeHash = CarListUtil.manufactureCount(carList);
    // convert hash into arrays for making bar chart
    let makes = Object.keys(carMakeHash);
    let makesCount = Object.values(carMakeHash);
    // test bar chart
    ChartUtil.makeBarChart(makes, makesCount);
    // count of models by country
    let countryCount = {};
    for (var i = 0; i < carList.length; i++) {
      let currentCar = carList[i];
      let country = currentCar.make_country;
      if (countryCount[country] === undefined) {
        countryCount[country] = 1;
      } else {
        countryCount[country] += 1;
      }
    }
    console.log(countryCount);

    $(document).ready(() => {
      $('.cars-select1').select2();
      $('.cars-select2').select2();
      $('.cars-select1').change((e) => {
        console.log($('cars-select1').selectedIndex);
      });
    });

    // add cars to select dropdown
    var optionsList1 = document.getElementById('cars1').options;
    var optionsList2 = document.getElementById('cars2').options;
    carScoreArr.forEach( (option, idx) => optionsList1.add( new Option(option.model, idx) ) );
    carScoreArr.forEach( (option, idx) => optionsList2.add( new Option(option.model, idx) ) );
    console.log(carScoreArr);
  });
}

carData();
// makeChart();
