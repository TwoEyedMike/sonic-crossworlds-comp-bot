/**
 * Greedy partition players into K sets of X numbers
 * @param {Object} objects 
 * @param {Number} setCount 
 * @param {Number} partitionSize 
 * @param {String} valueKey 
 */
function greedyPartition(objects, setCount, partitionSize, valueKey) {
  objects.sort((a, b) => b[valueKey] - a[valueKey]);
  const sets = Array.from({ length: setCount }, () => []);

  for (const o in objects) {
    const emptySetIndex = sets.findIndex((s) => s.length === 0);

    if (emptySetIndex === -1) {
      /* Once every set has at least one number in it we push numbers into the set with the lowest sum */
      const incompleteSets = sets.filter((s) => s.length < partitionSize);

      if (incompleteSets.length === 0) {
        continue;
      }

      incompleteSets.sort((a, b) => a.reduce((acc, v) => acc + v[valueKey], 0) - b.reduce((acc, v) => acc + v[valueKey], 0));
      incompleteSets[0].push(objects[o]);
    } else {
      /* As long as sets are empty we are pushing numbers into them */
      sets[emptySetIndex].push(objects[o]);
    }
  }

  return sets;
}

module.exports = greedyPartition;