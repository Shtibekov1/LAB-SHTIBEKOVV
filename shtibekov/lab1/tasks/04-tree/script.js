/*
  Строим строку-ёлку, где строки чередуют символы '*' и '#',
  длина строки растёт на 1, в конце ствол '||'.
*/
function buildTree(levels = 12) {
  let lines = [">"];
  let useStar = true;
  for (let i = 1; i <= levels; i++) {
    const ch = useStar ? '*' : '#';
    lines.push(ch.repeat(i));
    useStar = !useStar;
  }
  lines.push("||");
  return lines.join('\n');
}

const out = document.getElementById('out');
const tree = buildTree(12);
out.textContent = tree;
console.log(tree);
