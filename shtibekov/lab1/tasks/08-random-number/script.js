/*
  randomNumber(min, max) — целое число из [min, max]
*/
function randomNumber(min, max) {
  if (typeof min !== 'number' || typeof max !== 'number' || min > max) {
    throw new TypeError('min и max — числа, min <= max');
  }
  const a = Math.ceil(min);
  const b = Math.floor(max);
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

// --- ДЕМО ---
const out = document.getElementById('out');
const lines = [];
lines.push("randomNumber(0, 10) -> " + randomNumber(0,10));
lines.push("randomNumber(-10, 10) -> " + randomNumber(-10,10));
out.textContent = lines.join('\n');
console.log(lines.join('\n'));
