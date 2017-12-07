// returns array of car scores object for the radar chart
export const radarScores = (carList) => {
  // filter out cars that don't have a 0-60 time
  let filteredCarList = [];

  for (var i = 0; i < carList.length; i++) {
    let currentCar = carList[i];
    if (currentCar.model_0_to_100_kph != null) {
      filteredCarList.push(currentCar);
    }
  }

  var carScoreArr = [];

  for (var j = 0; j < filteredCarList.length; j++) {
    let car = filteredCarList[j];
    let carObj = {};
    // create name string
    let carMake = car.make_display;
    let carModel = car.model_name;
    let carTrim = car.model_trim;
    let carYear = car.model_year;
    let fullName = `${carYear} ${carMake} ${carModel} ${carTrim}`;
    // convert power from ps to hp
    let carHp = Math.round(car.model_engine_power_ps * 0.98632);
    // convert torque from Nm to ft-lbs
    let carTorque = Math.round(car.model_engine_torque_nm / 1.3558)
    // convert top speed to mph
    let carTopSpeed = Math.round(car.model_top_speed_kph * 0.621371);
    // convert weight from kg to lbs
    let carWeight = Math.round(car.model_weight_kg * 2.20462);
    // calculate scores for radar chart
    // 700PS = 10
    let powerScore = Math.round((car.model_engine_power_ps / 700) * 100) / 10;
    if (powerScore > 10) powerScore = 10;
    // 800 NM = 10
    let torqueScore = Math.round((car.model_engine_torque_nm / 800) * 100) / 10;
    if (torqueScore > 10) torqueScore = 10;
    // 2.5sec to 62mph = 10
    let accScore = Math.round((2.5 / car.model_0_to_100_kph) * 100) / 10;
    if (accScore > 10) accScore = 10;
    // 375kmph = 10
    let speedScore = Math.round((car.model_top_speed_kph / 375) * 100) / 10;
    if (speedScore > 10) speedScore = 10;
    // 2500KG = 10
    let weightScore = Math.round((car.model_weight_kg / 2500) * 100) / 10;
    if (weightScore > 10) weightScore = 10;
    var carScores = [powerScore, torqueScore, accScore, speedScore, weightScore];
    // assign values to keys in car object
    carObj["model"] = fullName;
    carObj["scores"] = carScores;
    carObj["power"] = carHp;
    carObj["torque"] = carTorque;
    carObj["acceleration"] = car.model_0_to_100_kph;
    carObj["topspeed"] = carTopSpeed;
    carObj["weight"] = carWeight;
    // add it to the car objects array
    carScoreArr.push(carObj);
  }

  return carScoreArr;
};

export const manufactureCount = (carList) => {
  let carMakeModelArr = [];
  let carMakeArr = [];
  let powerArr = [];
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

  return carMakeHash;
};
