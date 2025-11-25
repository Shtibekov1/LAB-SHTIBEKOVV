/*
  toBeCloseTo(num1, num2, tolerance = Number.EPSILON * 10)
  Возвращает true, если числа приблизительно равны.
*/
function toBeCloseTo(num1, num2, tolerance = Number.EPSILON * 10) {
  if (![num1, num2, tolerance].every(Number.isFinite)) {
    throw new TypeError('Аргументы должны быть конечными числами');
  }
  // относительная проверка: масштабируем на величину чисел
  const diff = Math.abs(num1 - num2);
  const scale = Math.max(1, Math.abs(num1), Math.abs(num2));
  return diff <= tolerance * scale;
}

// --- ДЕМО ---
const out = document.getElementById('out');
const lines = [];
lines.push("toBeCloseTo(0.1 + 0.2, 0.3) -> " + toBeCloseTo(0.1 + 0.2, 0.3));
lines.push("toBeCloseTo(1000000.000001, 1000000) -> " + toBeCloseTo(1000000.000001, 1000000));
lines.push("toBeCloseTo(1.0, 1.1) -> " + toBeCloseTo(1.0, 1.1));
out.textContent = lines.join('\n');
console.log(lines.join('\n'));
