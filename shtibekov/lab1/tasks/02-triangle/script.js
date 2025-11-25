/* 
  По трём сторонам a,b,c проверяем существование треугольника.
  Если существует — считаем периметр, площадь (формула Герона) и их соотношение.
*/
function triangleInfo(a, b, c) {
  if (![a,b,c].every(x => typeof x === 'number' && x > 0)) {
    throw new TypeError('Стороны должны быть положительными числами');
  }
  const exists = (a + b > c) && (a + c > b) && (b + c > a);
  if (!exists) {
    return { exists, perimeter: null, area: null, ratio: null };
  }
  const perimeter = a + b + c;
  const s = perimeter / 2;
  const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
  const ratio = perimeter / area;
  return { exists, perimeter, area, ratio };
}

// --- ДЕМО ВЫВОД ---
const out = document.getElementById('out');
function fmt(n){ return (n==null? n : (""+n.toFixed(4)).replace(/\.0+$/,'')); }

const ex1 = triangleInfo(3,4,5);
const ex2 = triangleInfo(1,2,10);

let lines = [];
if (ex1.exists) {
  lines.push("> треугольник существует");
  lines.push("> периметр = " + fmt(ex1.perimeter));
  lines.push("> площадь = " + fmt(ex1.area));
  lines.push("> соотношение = " + fmt(ex1.ratio));
} else {
  lines.push("> треугольника не существует");
}
lines.push("");
if (ex2.exists) {
  lines.push("> треугольник существует");
} else {
  lines.push("> треугольника не существует");
}
out.textContent = lines.join('\n');
console.log(lines.join('\n'));
