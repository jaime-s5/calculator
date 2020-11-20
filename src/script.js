// Object representing the tokens of a combination (A + B)
// Operands are strings to have more control over how numbers are handled
const tokens = {
  leftOperand: '0',
  operator: '',
  rightOperand: '',
};

const DISPLAY_SIZE = 9;

const operators = {
  '+': 'add',
  '-': 'substract',
  '/': 'divide',
  '*': 'multiply',
};

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

  if (operator === operators['+']) result = math.add(leftOperand, rightOperand);
  else if (operator === operators['-'])
    result = math.substract(leftOperand, rightOperand);
  else if (operator === operators['/'])
    result = math.divide(leftOperand, rightOperand);
  else if (operator === operators['*'])
    result = math.multiply(leftOperand, rightOperand);

  return result;
}

function concatDots(string) {
  const slicePosition = string.length - DISPLAY_SIZE;
  return '...'.concat(string.substr(slicePosition));
}

function getExponential(string) {
  return parseFloat(string)
    .toExponential(DISPLAY_SIZE - 5)
    .toString();
}

function getFormatedString(string) {
  if (string.includes('.') && !string.includes('e')) {
    const lengthIntPart = parseInt(string).toString().length;

    if (lengthIntPart >= DISPLAY_SIZE - 1) return getExponential(string);

    return parseFloat(string)
      .toFixed(DISPLAY_SIZE - lengthIntPart - 1)
      .toString();
  }

  return getExponential(string);
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

function reset() {
  erase();
  populateDisplay('0');
}

function insertNumber(number) {
  const operand = getOperand();

  // Erases result if introducing new number after equal was clicked
  if (equalWasClicked && operand === 'leftOperand') erase();
  equalWasClicked = false;

  const result =
    tokens[operand].charAt(0) === '0' && !tokens[operand].includes('.')
      ? tokens[operand].slice(1)
      : tokens[operand];

  tokens[operand] = result + number;
  populateDisplay(tokens[operand], 'input');
}

function insertDecimal() {
  const operand = getOperand();

  // Erases result if introducing new number after equal was clicked
  if (equalWasClicked && operand === 'leftOperand') erase();
  equalWasClicked = false;

  if (tokens[operand].includes('.')) return;

  // If operand is empty, populate with 0 before dot
  if (!tokens[operand]) tokens[operand] = '0';

  tokens[operand] = tokens[operand].concat('.');
  populateDisplay(tokens[operand], 'input');
}

function deleteDigit() {
  const operand = getOperand();

  // Erases result if introducing new number after equal was clicked
  if (equalWasClicked && operand === 'leftOperand') erase();
  equalWasClicked = false;

  // If operand is empty or matchs regex, assign 0 or delete until 0
  if (
    !tokens[operand] ||
    tokens[operand].match(/^-?\d$/) ||
    tokens[operand].match(/^-0\.$/)
  )
    tokens[operand] = '0';
  else tokens[operand] = tokens[operand].slice(0, -1);

  populateDisplay(tokens[operand], 'input');
}

function changeSign(operand) {
  return tokens[operand].charAt(0) === '-'
    ? tokens[operand].slice(1)
    : '-'.concat(tokens[operand]);
}

function insertNegative() {
  const operandStore = getOperand();

  const operandCopy =
    getPopulationTokens() === 3 ? 'rightOperand' : 'leftOperand';

  if (tokens[operandCopy] === '0' || tokens[operandCopy].match('Infinity'))
    return;

  tokens[operandStore] = changeSign(operandCopy);

  // Format display accordingly if number inputed or result displayed
  let flag = 'result';
  if (equalWasClicked) flag = 'result';
  else if (operandStore === operandCopy) flag = 'input';

  populateDisplay(tokens[operandStore], flag);
}

function insertMathOperator(mathOperator) {
  if (getPopulationTokens() === 3) {
    const result = operate(
      parseFloat(tokens.leftOperand),
      tokens.operator,
      parseFloat(tokens.rightOperand)
    ).toString();
    erase();
    tokens.leftOperand = result;
    tokens.operator = mathOperator;
    populateDisplay(result);
  } else if (getPopulationTokens() === 2 || getPopulationTokens() === 1) {
    tokens.operator = mathOperator;
  }
}

function evaluate() {
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

function keyPressed(event) {
  if (event.key.match(/^\d$/)) insertNumber(event.key);
  else if (event.key === 'Backspace') deleteDigit();
  else if (event.key === 'Enter') {
    event.preventDefault(); // Prevents pressing of a focused button
    evaluate();
  } else if (event.key === '.') insertDecimal();
  else if (event.key.match(/[+\-*/]/)) insertMathOperator(operators[event.key]);
  else if (event.key === 'Escape') reset();
}

function getPercent() {
  const operandStore = getOperand();

  const operandCopy =
    getPopulationTokens() === 3 ? 'rightOperand' : 'leftOperand';

  if (tokens[operandCopy] === '0' || tokens[operandCopy].match('Infinity'))
    return;

  tokens[operandStore] = operate(
    parseFloat(tokens[operandCopy]),
    operators['/'],
    100
  ).toString();

  populateDisplay(tokens[operandStore]);
}

window.onload = function main() {
  // Default value on display
  populateDisplay('0');

  // Event listeners
  document
    .querySelectorAll('.number')
    .forEach((element) =>
      element.addEventListener('click', (event) =>
        insertNumber(event.currentTarget.innerText)
      )
    );
  document
    .querySelectorAll('.math-operator')
    .forEach((element) =>
      element.addEventListener('click', (event) =>
        insertMathOperator(event.currentTarget.getAttribute('id'))
      )
    );
  document.querySelector('#equal').addEventListener('click', evaluate);
  document.querySelector('#ac').addEventListener('click', reset);
  document.querySelector('#sign').addEventListener('click', insertNegative);
  document.querySelector('#decimal').addEventListener('click', insertDecimal);
  document.querySelector('#del').addEventListener('click', deleteDigit);
  document.querySelector('#percentage').addEventListener('click', getPercent);
  window.addEventListener('keydown', keyPressed);
};
