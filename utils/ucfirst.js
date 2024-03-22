/**
 * Capitalizes the first letter of a string
 */
function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = ucfirst;
