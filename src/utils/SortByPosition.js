/**
 * Sort results array by position, setting null positions last
 *
 * @param {array} array of results
 * @param {string} field custom field for sorting
 * @returns {array}
 */
export default function (array, field = "position") {
  return array.sort(function (a, b) {
    return (
      (a.result === null) - (b.result === null) ||
      +(a[field] > b[field]) ||
      -(a[field] < b[field])
    );
  });
}
