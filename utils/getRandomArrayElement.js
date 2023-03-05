/**
 * Returns a random array value
 * @returns {*}
 */
function getRandomArrayElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

module.exports = getRandomArrayElement;