/*
  Проверяем, делится ли n на x и y одновременно.
*/
function isDivisible(n, x, y) {
  if (![n,x,y].every(v => Number.isInteger(v) && v !== 0)) {
    throw new TypeError('n, x, y должны быть ненулевыми целыми числами');
  }
  return (n % x === 0) && (n % y === 0);
}

// --- ДЕМО ВЫВОД ---
const out = document.getElementById('out');
const cases = [
  {n:3,  x:1, y:3},
  {n:12, x:2, y:6},
  {n:100,x:5, y:3},
  {n:12, x:7, y:5},
];
const lines = cases.map(o => {
  const r = isDivisible(o.n, o.x, o.y);
  return `> n = ${o.n.toString().padStart(3,' ')}, x = ${o.x}, y = ${o.y} => ${String(r).padStart(5,' ')}`;
});
out.textContent = lines.join('\n');
console.log(lines.join('\n'));
