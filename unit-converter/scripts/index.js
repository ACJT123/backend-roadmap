document.addEventListener("DOMContentLoaded", () => {
  loadForm("length.html");
});

function loadForm(file) {
  fetch(file)
    .then((response) => response.text())
    .then((html) => {
      const formContainer = document.getElementById("form-container");
      const resultContainer = document.getElementById("result-container");

      formContainer.style.display = "block";
      resultContainer.style.display = "none";
      formContainer.innerHTML = html;

      // Manage active tab button
      document.querySelectorAll(".tabs-button").forEach((button) => {
        button.classList.remove("active");
      });
      document
        .querySelector(`[onclick="loadForm('${file}')"]`)
        .classList.add("active");
    })
    .catch((error) => console.error("Error loading form:", error));
}

function convert(event, measurement) {
  event.preventDefault();

  const form = document.getElementById(`${measurement}-form`);
  const value = parseFloat(form["length"].value);
  const fromUnit = form["from"].value;
  const toUnit = form["to"].value;

  if (isNaN(value)) {
    alert("Please enter a valid number.");
    return;
  }

  const result = convertValue(value, fromUnit, toUnit, measurement);

  if (result !== null) {
    displayResult(value, fromUnit, result, toUnit);
  }
}

function convertValue(value, fromUnit, toUnit, measurement) {
  switch (measurement) {
    case "length":
      return convertLength(value, fromUnit, toUnit);
    case "weight":
      return convertWeight(value, fromUnit, toUnit);
    case "temperature":
      return convertTemperature(value, fromUnit, toUnit);
    default:
      console.error(`Unknown measurement type: ${measurement}`);
      return null;
  }
}

function displayResult(value, fromUnit, result, toUnit) {
  document.getElementById("result-container").style.display = "block";
  document.getElementById("form-container").style.display = "none";
  document.getElementById(
    "result-text"
  ).innerText = `${value} ${fromUnit} = ${result} ${toUnit}`;
}

function convertLength(value, fromUnit, toUnit) {
  const lengthUnits = {
    m: 1,
    km: 0.001,
    ft: 3.28084,
    mi: 0.000621371,
  };
  return convertUnits(value, fromUnit, toUnit, lengthUnits);
}

function convertWeight(value, fromUnit, toUnit) {
  const weightUnits = {
    grams: 1,
    kilograms: 0.001,
    pounds: 0.00220462,
    ounces: 0.035274,
  };
  return convertUnits(value, fromUnit, toUnit, weightUnits);
}

function convertUnits(value, fromUnit, toUnit, units) {
  const valueInBaseUnit = value / units[fromUnit];
  return valueInBaseUnit * units[toUnit];
}

function convertTemperature(value, fromUnit, toUnit) {
  if (fromUnit === toUnit) return value;

  let celsiusValue;
  switch (fromUnit) {
    case "celsius":
      celsiusValue = value;
      break;
    case "fahrenheit":
      celsiusValue = (value - 32) * (5 / 9);
      break;
    case "kelvin":
      celsiusValue = value - 273.15;
      break;
    default:
      console.error("Invalid fromUnit for temperature.");
      return null;
  }

  switch (toUnit) {
    case "celsius":
      return celsiusValue;
    case "fahrenheit":
      return celsiusValue * (9 / 5) + 32;
    case "kelvin":
      return celsiusValue + 273.15;
    default:
      console.error("Invalid toUnit for temperature.");
      return null;
  }
}

function reset() {
  document.getElementById("form-container").style.display = "block";
  document.getElementById("result-container").style.display = "none";
}
