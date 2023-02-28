/**
 * Compares 2 Arrays. Only works on one-dimensional arrays with scalar values
 * @param {Array} array1 
 * @param {Array} array2 
 * @returns 
 */
function compareArrays(array1, array2) {
    const array1Sorted = array1.slice().sort();
  const array2Sorted = array2.slice().sort();

  return array1.length === array2.length && array1Sorted.every(function (value, index) {
    return value === array2Sorted[index];
  });
}

module.exports = compareArrays;