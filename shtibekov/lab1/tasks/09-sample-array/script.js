/*
  sampleArray(arr, count) — возвращает новый массив из count случайных элементов исходного массива.
  С повторениями (как в примере [2, 2, 1]).
*/
function randomNumber(min, max) {
  const a = Math.ceil(min);
  const b = Math.floor(max);
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
function sampleArray(arr, count) {
  if (!Array.isArray(arr)) throw new TypeError('arr должен быть массивом');
  if (!Number.isInteger(count) || count < 0) throw new RangeError('count — неотрицательное целое');
  const result = [];
  for (let i = 0; i < count; i++) {
    const idx = randomNumber(0, arr.length - 1);
    result.push(arr[idx]);
  }
  return result;
}

// --- ДЕМО ---
const out = document.getElementById('out');
const lines = [];
lines.push("sampleArray([1,2,3,4], 2) -> " + JSON.stringify(sampleArray([1,2,3,4], 2)));
lines.push("sampleArray([1,2,3,4], 3) -> " + JSON.stringify(sampleArray([1,2,3,4], 3)));
out.textContent = lines.join('\n');
console.log(lines.join('\n'));
