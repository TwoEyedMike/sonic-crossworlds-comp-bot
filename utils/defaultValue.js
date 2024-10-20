/**
 * Returns the value or a default value if the value is undefined
 * @param value
 * @param defaultValue
 * @returns {*}
 */
function defaultValue(value, defaultValue) {
  return value === undefined || value === null ? defaultValue : value;
}

module.exports = defaultValue;
