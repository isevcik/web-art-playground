const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const margin = 8;
const cx = window.innerWidth - (2 * margin);
const cy = window.innerHeight - (2 * margin);
canvas.width = cx;
canvas.height = cy;

const logDiv = document.querySelector("#log");

function log(...args) {
  if (!logDiv) {
    return;
  }

  const converted = args.map(line => {
    return typeof line === "string"
      ? line
      : JSON.stringify(line, null, 2);
  });

  logDiv.innerHTML = converted.join(" ");
}


let lastTimeDrawn = performance.now();
function frame(time) {
  const diffTime = (time - lastTimeDrawn) || 0;

  if (diffTime < 50) {
    requestAnimationFrame(frame);
    return;
  }

  lastTimeDrawn = time;

  const odd = randFromTo(1, 11, true);
  const hue = odd === 2
    ? 350
    : 200;

  ctx.fillStyle = randColorHsl(hue);
  ctx.beginPath();
  ctx.arc(randFromTo(1, cx + 1), randFromTo(1, cy + 1), randFromTo(10, 50), 0, 2 * Math.PI);
  ctx.fill();

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

const stats = {};
function randFromTo(from, to, addToLog) {
  // return from + rand() % (to - from);
  // ^ we cannot use simple % because we got weird biased results

  const range = 2147483647 // modulus value from rand() minus 1
  const number = Math.floor(from + rand() / range * (to - from));

  if (addToLog) {
    stats[`${number}`] = (stats[`${number}`] || 0) + 1;
    log(stats);
  }

  return number;
}

let seed = 1980;
function rand() {
  // https://en.wikipedia.org/wiki/Linear_congruential_generator
  // values taken from https://www.ams.org/journals/mcom/1999-68-225/S0025-5718-99-00996-5/S0025-5718-99-00996-5.pdf

  const multiplier = 602169653;
  const increment = 0;
  const modulus = 2147483648;

  seed = (multiplier * seed + increment) % modulus;

  return seed;
}

// function randColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * letters.length)];
//   }
//   return color;
// }

function randColorHsl(hue) {
  const saturation = 100;
  const lightness = randFromTo(1, 101);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}


