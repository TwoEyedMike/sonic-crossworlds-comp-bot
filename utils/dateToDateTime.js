/**
 * Prefixes zero if a number is smaller than 10
 * @param Number value 
 * @returns String
 */
function prefixZero(value) {
  if (value < 10) {
    return `0${value}`;
  }

  return value
}

/**
 * Converts a date object to an iso date time string
 * @param Date date 
 * @returns String
 */
function dateToDateTime(date) {
  const year = date.getFullYear();
  const month = prefixZero(date.getMonth() + 1);
  const day = prefixZero(date.getDate());
  const hours = prefixZero(date.getHours());
  const minutes = prefixZero(date.getMinutes());
  const seconds = prefixZero(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

module.exports = dateToDateTime;
