import Chart from 'chart.js';

var colors = [];

var COLOR_NAMES = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];


function makeChart(carMakes, count) {
  var carColors = COLOR_NAMES.slice(0, carMakes.length);
  var ctx = document.getElementById("chart").getContext('2d');
  var myChart = new Chart(ctx, {
      type: 'horizontalBar',
      data: {
          labels: carMakes,
          datasets: [{
              label: '# of Models over 500HP',
              data: count,
              backgroundColor: carColors
          }]
      },
      options: {
        legend: { display: false },
        title: {
          display: true,
          text: "Manufactures of Cars Over 500HP"
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
      }
  });
}

function makeSpiderChart(carScoreObj) {
  new Chart(document.getElementById("radar-chart"), {
    type: 'radar',
    data: {
      labels: ["Horsepower", "Torque", "Acceleration", "Top Speed", "Weight"],
      datasets: [
        {
          label: carScoreObj.model,
          fill: true,
          backgroundColor: "rgba(179,181,198,0.2)",
          borderColor: "rgba(179,181,198,1)",
          pointBorderColor: "#fff",
          pointBackgroundColor: "rgba(179,181,198,1)",
          data: carScoreObj.scores
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: 'Performance Radar'
      },
      // scaleOverride: true,
      // scaleSteps: 5,
      // scaleStepWidth: 2,
      // scaleStartValue: 0
    }
  });
}

function carData() {
  const baseUrl = "https://www.carqueryapi.com/api/0.3/";

  $.getJSON(baseUrl+"?callback=?", {cmd:"getTrims", min_power:400, min_top_speed: 10, min_torque: 10, min_weight:10 }, (data) => {
    const carList = data.Trims;
    // full car list array of objects
    console.log(carList);
    // filter out cars that don't have a 0-60 time
    var filteredCarList = [];
    for (var i = 0; i < carList.length; i++) {
      let currentCar = carList[i];
      if (currentCar.model_0_to_100_kph != null) {
        filteredCarList.push(currentCar);
      }
    }
    console.log(filteredCarList);
    // create array of objects with a model name and scores array
    var carScoreArr = [];
    for (var i = 0; i < filteredCarList.length; i++) {
      var car = filteredCarList[i];
      var carObj = {};
      let carMake = car.make_display;
      let carModel = car.model_name;
      let carTrim = car.model_trim;
      let fullName = `${carMake} ${carModel} ${carTrim}`;
      let powerScore = Math.round((car.model_engine_power_ps / 700) * 100) / 10;
      // 800 NM
      let torqueScore = Math.round((car.model_engine_torque_nm / 800) * 100) / 10;
      // 2.5sec to 62mph
      let accScore = Math.round((2.5 / car.model_0_to_100_kph) * 100) / 10;
      // 375kmph
      let speedScore = Math.round((car.model_top_speed_kph / 375) * 100) / 10;
      // 2500KG
      let weightScore = Math.round((car.model_weight_kg / 2500) * 100) / 10;
      var carScores = [powerScore, torqueScore, accScore, speedScore, weightScore];
      carObj["model"] = fullName;
      carObj["scores"] = carScores;
      carScoreArr.push(carObj);
    }

    console.log(carScoreArr);
    makeSpiderChart(carScoreArr[0]);
    // let testCar = filteredCarList[0];
    // // 700 PS
    // let powerScore = Math.round((testCar.model_engine_power_ps / 700) * 100) / 10;
    // // 800 NM
    // let torqueScore = Math.round((testCar.model_engine_torque_nm / 800) * 100) / 10;
    // // 2.5sec to 62mph
    // let accScore = Math.round((2.5 / testCar.model_0_to_100_kph) * 100) / 10;
    // // 375kmph
    // let speedScore = Math.round((testCar.model_top_speed_kph / 375) * 100) / 10;
    // // 2500KG
    // let weightScore = Math.round((testCar.model_weight_kg / 2500) * 100) / 10;

    // console.log(testCar);
    // console.log(powerScore);
    // console.log(torqueScore);
    // console.log(accScore);
    // console.log(speedScore);
    // console.log(weightScore);


    // console.log(`${largestPower}PS - ${largestTorque}NM - ${largestTopSpeed}KMPH`);
    // console.log(`${fastestAccleration}sec - ${heaviestWeight}KG`);


    // code for manufactures/count chart
    let carMakeModelArr = [];
    let carMakeArr = [];
    let powerArr = [];
    let topSpeedArr = [];
    let carMakeHash={};
    for (var i = 0; i < carList.length; i++) {
      let currentCar = carList[i];
      let carMake = currentCar.make_display;
      let carModel = currentCar.model_name;
      let carTrim = currentCar.model_trim;
      let fullName = `${carMake} ${carModel} ${carTrim}`;
      carMakeModelArr.push(fullName);
      carMakeArr.push(carMake);
      powerArr.push(currentCar.model_engine_power_ps);

      if (carMakeHash[carMake] === undefined) {
        carMakeHash[carMake] = 1;
      } else {
        carMakeHash[carMake] += 1;
      }
    }
    let makes = Object.keys(carMakeHash);
    let makesCount = Object.values(carMakeHash);
    // makeChart(makes, makesCount);


  });
}

carData();
// makeChart();
