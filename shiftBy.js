function shiftBy(arr, shift) {
  if (arr.length <= 1) return arr;

  shift = shift % arr.length;
  let i = 0;
  if (shift > 0) {
    while (i < shift) {
      arr.unshift(arr.pop());
      i++;
    }
  } else if (shift < 0) {
    while (i > shift) {
      arr.push(arr.shift());
      i--;
    }
  }
  return arr;
}

console.log(shiftBy([0, 1, 2, 3, 4, 5], 2));
console.log(shiftBy([0, 1, 2, 3, 4, 5], 8));
console.log(shiftBy([2, 5, 7], 2));
console.log(shiftBy([2, 5, 7], -2));
console.log(shiftBy([0], -2));
