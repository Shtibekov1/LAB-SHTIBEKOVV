/*
  Для сэндвича нужно 2 хлеба и 1 сыр.
  Возвращаем максимально возможное количество.
*/
function countSandwiches(stock) {
  if (typeof stock !== 'object' || stock === null) {
    throw new TypeError('Нужен объект { bread, cheese }');
  }
  const bread = Math.floor(stock.bread ?? 0);
  const cheese = Math.floor(stock.cheese ?? 0);
  if (bread < 0 || cheese < 0) throw new RangeError('Количество не может быть отрицательным');
  const byBread = Math.floor(bread / 2);
  return Math.min(byBread, cheese);
}

// --- ДЕМО ---
const out = document.getElementById('out');
const lines = [];
lines.push("countSandwiches({bread: 5, cheese: 6}) -> " + countSandwiches({bread:5, cheese:6}));
lines.push("countSandwiches({bread: 2, cheese: 10}) -> " + countSandwiches({bread:2, cheese:10}));
out.textContent = lines.join('\n');
console.log(lines.join('\n'));
