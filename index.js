let button = document.getElementById("generate-colors-button");
let hexDecimalNumberSystem = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
];

let firstColorBox = document.getElementById("first-color-box");
let firstHexCode = document.getElementById("first-hex-code");
let secondColorBox = document.getElementById("second-color-box");
let secondHexCode = document.getElementById("second-hex-code");
let thirdColorBox = document.getElementById("third-color-box");
let thirdHexCode = document.getElementById("third-hex-code");
function getRandomNumber() {
  let randomNumber = Math.floor(Math.random() * hexDecimalNumberSystem.length);
  return randomNumber;
}
button.addEventListener("click", function () {
  let hexCode = "#";

  for (let x = 0; x < 6; x++) {
    hexCode += hexDecimalNumberSystem[getRandomNumber()];
  }

  firstColorBox.style.backgroundColor = hexCode;
  firstHexCode.textContent = hexCode;

  let hexCode2 = "#";

  for (let x = 0; x < 6; x++) {
    hexCode2 += hexDecimalNumberSystem[getRandomNumber()];
  }

  secondColorBox.style.backgroundColor = hexCode2;
  secondHexCode.textContent = hexCode2;

  let hexCode3 = "#";

  for (let x = 0; x < 6; x++) {
    hexCode3 += hexDecimalNumberSystem[getRandomNumber()];
  }

  thirdColorBox.style.backgroundColor = hexCode3;
  thirdHexCode.textContent = hexCode3;
});
