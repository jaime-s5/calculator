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
