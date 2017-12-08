import * as ChartUtil from './chart_util';
import * as CarListUtil from './carlist_util';

function carData() {
  const baseUrl = "https://www.carqueryapi.com/api/0.3/";
  // call to Carquery API
  $.getJSON(baseUrl+"?callback=?", {cmd:"getTrims", min_power:400, min_top_speed: 10, min_torque: 10, min_weight:10 }, (data) => {
    // full car list array of objects
    const carList = data.Trims;
    // radar chat array of car objects
    const carScoreArr = CarListUtil.radarScores(carList);
    // pick two random cars to display
    var randomCar1 = Math.floor(Math.random() * (carScoreArr.length));
    var randomCar2 = Math.floor(Math.random() * (carScoreArr.length));
    // initial radar chart
    ChartUtil.makeSpiderChart(carScoreArr[randomCar1],carScoreArr[randomCar2]);
    // initial car info fields
    setInfoFields(carScoreArr[randomCar2], carScoreArr[randomCar1]);

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

    // give dropdowns a searchable feature with select2
    $(document).ready(() => {
      $('.cars-select1').select2();
      $('.cars-select2').select2();
    });

    // assign the dropdowns to variables
    let select1 = document.getElementById("cars2");
    let select2 = document.getElementById("cars1");

    // add cars to select dropdown
    let optionsList1 = document.getElementById('cars1').options;
    let optionsList2 = document.getElementById('cars2').options;
    carScoreArr.forEach( (option, idx) => optionsList1.add( new Option(option.model, idx) ) );
    carScoreArr.forEach( (option, idx) => optionsList2.add( new Option(option.model, idx) ) );

    // add onclick callback to re-render chart with selected cars
    let compareButton = document.getElementById("compare-button");
    compareButton.onclick = () => {
      let car1Idx = select1.options[select1.selectedIndex].value;
      let car2Idx = select2.options[select2.selectedIndex].value;
      // populate car info table
      setInfoFields(carScoreArr[car1Idx], carScoreArr[car2Idx]);
      // re-render the spider chart
      ChartUtil.makeSpiderChart(carScoreArr[car2Idx],carScoreArr[car1Idx]);
    };

    // opens the side pane on click and renders the bar graph
    let openButton = document.getElementById("graph-button");
    openButton.onclick = () => {
      // hash containing manufacture and model count
      let carMakeHash = CarListUtil.manufactureCount(carList);
      // convert hash into arrays for making bar chart
      let makes = Object.keys(carMakeHash);
      let makesCount = Object.values(carMakeHash);
      // render bar chart
      ChartUtil.makeBarChart(makes, makesCount);
      document.getElementById("mySidenav").style.width = "100%";
    };

    // closes the side pane on click
    let closeButton = document.getElementById("close-button");
    closeButton.onclick = () => {
      document.getElementById("mySidenav").style.width = "0";
    };
  });
}

function setInfoFields(car1, car2) {
  // populate first car's info table
  document.getElementById("car1-info-name").innerHTML = car1.model;
  document.getElementById("car1-info-power").innerHTML = `${car1.power} hp`;
  document.getElementById("car1-info-torque").innerHTML = `${car1.torque} ft-lbs`;
  document.getElementById("car1-info-acceleration").innerHTML = `${car1.acceleration} sec`;
  document.getElementById("car1-info-topspeed").innerHTML = `${car1.topspeed} mph`;
  document.getElementById("car1-info-weight").innerHTML = `${car1.weight} lbs`;
  // populate second cars info table
  document.getElementById("car2-info-name").innerHTML = car2.model;
  document.getElementById("car2-info-power").innerHTML = `${car2.power} hp`;
  document.getElementById("car2-info-torque").innerHTML = `${car2.torque} ft-lbs`;
  document.getElementById("car2-info-acceleration").innerHTML = `${car2.acceleration} sec`;
  document.getElementById("car2-info-topspeed").innerHTML = `${car2.topspeed} mph`;
  document.getElementById("car2-info-weight").innerHTML = `${car2.weight} lbs`;
}

carData();
