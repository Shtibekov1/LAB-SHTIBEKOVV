/*
  myFilterArray(arr, predicate) — аналог Array.prototype.filter
  predicate(element) должен вернуть true/false для включения элемента.
*/
function myFilterArray(arr, predicate) {
  if (!Array.isArray(arr)) throw new TypeError('arr должен быть массивом');
  if (typeof predicate !== 'function') throw new TypeError('predicate должен быть функцией');
  const result = [];
  for (const el of arr) {
    if (predicate(el)) result.push(el);
  }
  return result;
}

// Пример фильтра: строка начинается на 'V'
function isFirstV(name) {
  return typeof name === 'string' && name.startsWith('V');
}

// Пример фильтра: число кратно 3
function divisibleBy3(n) {
  return Number.isFinite(n) && n % 3 === 0;
}

// --- ДЕМО ---
const out = document.getElementById('out');
const lines = [];
lines.push("myFilterArray(['Short', 'VeryLong'], isFirstV) -> " + JSON.stringify(myFilterArray(['Short','VeryLong'], isFirstV)));
lines.push("myFilterArray([1,2,3,4,5,6,7,8,9], divisibleBy3) -> " + JSON.stringify(myFilterArray([1,2,3,4,5,6,7,8,9], divisibleBy3)));
out.textContent = lines.join('\n');
console.log(lines.join('\n'));
