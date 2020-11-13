// Object representing the tokens of a combination (A + B)
// Operands are strings to have more control over how numbers are handled
const tokens = {
  leftOperand: '0',
  operator: '',
  rightOperand: '',
};

const DISPLAY_SIZE = 10;

// This variable allows to track if equal was clicked before introducing a number
let equalWasClicked = false;

const math = {
  add: (x, y) => x + y,
  substract: (x, y) => x - y,
  divide: (x, y) => x / y,
  multiply: (x, y) => x * y,
};

function operate(leftOperand, operator, rightOperand = leftOperand) {
  let result = null;

  if (operator === 'add') result = math.add(leftOperand, rightOperand);
  else if (operator === 'substract')
    result = math.substract(leftOperand, rightOperand);
  else if (operator === 'divide')
    result = math.divide(leftOperand, rightOperand);
  else if (operator === 'multiply')
    result = math.multiply(leftOperand, rightOperand);

  return result;
}

function concatDots(string) {
  const slicePosition = string.length - DISPLAY_SIZE;
  return '...'.concat(string.substr(slicePosition));
}

function getFormatedString(string) {
  if (string.includes('.') && string.includes('e')) {
    return parseFloat(string)
      .toPrecision(DISPLAY_SIZE - 4)
      .toString();
  }

  if (string.includes('.')) {
    const lengthIntPart = parseInt(string).toString().length;
    return parseFloat(string)
      .toFixed(DISPLAY_SIZE - lengthIntPart - 1)
      .toString();
  }

  return parseFloat(string)
    .toExponential(DISPLAY_SIZE - 4)
    .toString();
}

function populateDisplay(string, flag = 'result') {
  const display = document.querySelector('#display');
  let displayValue = string;

  if (displayValue === 'Infinity' || displayValue === '-Infinity') {
    display.innerText = 'NaN';
    return;
  }

  // If number is too big, needs formatting
  if (displayValue.length > DISPLAY_SIZE) {
    // Display number inputed by user
    if (flag === 'input') displayValue = concatDots(displayValue);

    // Display result from operation
    if (flag === 'result') displayValue = getFormatedString(displayValue);
  }

  display.innerText = displayValue;
}

function getPopulationTokens() {
  if (tokens.leftOperand && tokens.operator && tokens.rightOperand) return 3;
  if (tokens.leftOperand && tokens.operator) return 2;
  if (tokens.leftOperand) return 1;

  return 0;
}

function getOperand() {
  return getPopulationTokens() === 3 || getPopulationTokens() === 2
    ? 'rightOperand'
    : 'leftOperand';
}

function erase() {
  tokens.leftOperand = '0';
  tokens.operator = '';
  tokens.rightOperand = '';
}

function eraseClicked() {
  erase();
  populateDisplay('0');
}

function numberClicked(event) {
  const operand = getOperand();

  // Erases result if introducing new number after equal was clicked
  if (equalWasClicked && operand === 'leftOperand') erase();
  equalWasClicked = false;

  const result =
    tokens[operand].charAt(0) === '0'
      ? tokens[operand].slice(1)
      : tokens[operand];

  tokens[operand] = result + event.currentTarget.innerText;
  populateDisplay(tokens[operand], 'input');
}

function changeSign(operand) {
  return tokens[operand].charAt(0) === '-'
    ? tokens[operand].slice(1)
    : '-'.concat(tokens[operand]);
}

function signClicked() {
  const operandStore = getOperand();

  const operandCopy =
    getPopulationTokens() === 3 ? 'rightOperand' : 'leftOperand';

  if (tokens[operandCopy] === '0') return;

  tokens[operandStore] = changeSign(operandCopy);

  // Format display accordingly if number inputed or result displayed
  let flag = 'result';
  if (equalWasClicked) flag = 'result';
  else if (operandStore === operandCopy) flag = 'input';

  populateDisplay(tokens[operandStore], flag);
}

function mathOperatorClicked(event) {
  if (getPopulationTokens() === 3) {
    const result = operate(
      parseFloat(tokens.leftOperand),
      tokens.operator,
      parseFloat(tokens.rightOperand)
    ).toString();
    erase();
    tokens.leftOperand = result;
    tokens.operator = event.currentTarget.getAttribute('id');
    populateDisplay(result);
  } else if (getPopulationTokens() === 2 || getPopulationTokens() === 1) {
    tokens.operator = event.currentTarget.getAttribute('id');
  }
}

function equalClicked() {
  // If rightOperand is empty, we duplicate the number
  if (getPopulationTokens() === 2) tokens.rightOperand = tokens.leftOperand;

  if (getPopulationTokens() === 3 || getPopulationTokens() === 2) {
    const result = operate(
      parseFloat(tokens.leftOperand),
      tokens.operator,
      parseFloat(tokens.rightOperand)
    ).toString();
    erase();
    tokens.leftOperand = result;
    populateDisplay(result);
    equalWasClicked = true;
  }
}

window.onload = function main() {
  // Default value on display
  populateDisplay('0');

  // Event listeners
  document
    .querySelectorAll('.number')
    .forEach((element) => element.addEventListener('click', numberClicked));
  document
    .querySelectorAll('.math-operator')
    .forEach((element) =>
      element.addEventListener('click', mathOperatorClicked)
    );
  document.querySelector('#equal').addEventListener('click', equalClicked);
  document.querySelector('#ac').addEventListener('click', eraseClicked);
  document.querySelector('#sign').addEventListener('click', signClicked);
};
