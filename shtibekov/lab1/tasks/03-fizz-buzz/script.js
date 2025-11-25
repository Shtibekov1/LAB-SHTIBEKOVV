/*
  Переменная n — верхняя граница.
  Для i от 0 до n: чётное -> 'buzz', нечётное -> 'fizz', кратно 5 -> 'fizz buzz'.
  (Если число кратно 5, сообщение 'fizz buzz' имеет приоритет.)
*/
const out = document.getElementById('out');
const n = 20;
const lines = [];
for (let i = 0; i <= n; i++) {
  let text;
  if (i % 5 === 0) {
    text = "fizz buzz";
  } else if (i % 2 === 0) {
    text = "buzz";
  } else {
    text = "fizz";
  }
  lines.push(`> "${i} ${text}"`);
}
out.textContent = lines.join('\n');
console.log(lines.join('\n'));
