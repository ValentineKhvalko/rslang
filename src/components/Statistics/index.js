// const example = document.getElementById('example');


// const points = [
//   { x: 0, y: 100 },
//   { x: 50, y: 90 },
//   { x: 75, y: 100 },
//   { x: 100, y: 110 },
//   { x: 140, y: 100 },
//   { x: 150, y: 90 },
//   { x: 200, y: 172 },
//   { x: 260, y: 65 },
//   { x: 300, y: 90 },
//   { x: 320, y: 21 },
//   { x: 350, y: 100 },
// ];

export const createCoords = (points) => {
  const coords = [];

  for (let i = 1; i < points.length; i += 1) {
    const p0 = points[i - 1],
      p1 = points[i],
      dx = p1.x - p0.x,
      dy = p1.y - p0.y,
      steps = Math.max(Math.abs(dx), Math.abs(dy)) / 2;

    for (let j = 0; j < steps; j += 1) {
      coords.push({
        x: p0.x + (dx * j) / steps,
        y: p0.y + (dy * j) / steps,
      });
    }
  }

  return coords;
};

export const animate = (coords, index, ctx) => {
  if (index === coords.length) {
    return;
  }

  ctx.strokeStyle = 'red';
  ctx.lineCap = 'round';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(coords[index - 1].x, coords[index - 1].y);
  ctx.lineTo(coords[index].x, coords[index].y);
  ctx.stroke();

  requestAnimationFrame(animate.bind(null, coords, index + 1, ctx));
};
