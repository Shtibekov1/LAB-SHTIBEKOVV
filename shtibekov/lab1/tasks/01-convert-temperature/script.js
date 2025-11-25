/* 
  Задача: функция convertTemperature(value, direction)
  direction: 'toC' (из °F в °C) или 'toF' (из °C в °F)
  Возвращает строку вида '0 C' или '50 F'.
*/
function convertTemperature(value, direction) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new TypeError('value должен быть числом');
  }
  if (direction === 'toC') {
    const c = (value - 32) * (5/9);
    return trimNumber(c) + ' C';
  } else if (direction === 'toF') {
    const f = value * (9/5) + 32;
    return trimNumber(f) + ' F';
  }
  throw new Error("direction должен быть 'toC' или 'toF'");
}

// Вспомогательное форматирование: убираем хвосты .00
function trimNumber(n) {
  // Округляем до 2 знаков, потом обрезаем лишние нули
  const s = n.toFixed(2);
  return s.replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
}

// --- ДЕМО ВЫВОД ---
const out = document.getElementById('out');
const lines = [];
lines.push("convertTemperature(32, 'toC') -> " + convertTemperature(32, 'toC'));
lines.push("convertTemperature(10, 'toF') -> " + convertTemperature(10, 'toF'));
out.textContent = lines.join('\n');
console.log(lines.join('\n'));
