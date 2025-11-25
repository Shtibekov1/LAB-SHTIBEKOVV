/*
  absValue(x) — без Math.abs
*/
function absValue(x) {
  if (typeof x !== 'number' || Number.isNaN(x)) {
    throw new TypeError('x должен быть числом');
  }
  return x < 0 ? -x : x;
}

// --- ДЕМО ---
const out = document.getElementById('out');
const lines = [];
lines.push("absValue(-2) -> " + absValue(-2));
lines.push("absValue(100) -> " + absValue(100));
lines.push("absValue(0) -> " + absValue(0));
out.textContent = lines.join('\n');
console.log(lines.join('\n'));
