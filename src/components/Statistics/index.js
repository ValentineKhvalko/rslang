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

  ctx.strokeStyle = '#fff';
  ctx.lineCap = 'round';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(coords[index - 1].x, coords[index - 1].y);
  ctx.lineTo(coords[index].x, coords[index].y);
  ctx.stroke();

  requestAnimationFrame(animate.bind(null, coords, index + 1, ctx));
};

export const createStatisticBlock = (results, toStatistics) => {
  const canvasScale = document.createElement('canvas');
  canvasScale.classList.add('canvas');
  const ctx = canvasScale.getContext('2d');
  canvasScale.width = 275;
  canvasScale.height = 300;

  // блок для сатистики
  const statistic = document.createElement('div');
  statistic.classList.add('statisticBlock');

  // блок для шкал статиситки
  const statisticScale = document.createElement('div');
  statisticScale.classList.add('statisticScale');

  // блок для Y цифр
  const yAxisScale = document.createElement('div');
  yAxisScale.classList.add('yAxisScale');

  // блок для X цифр
  const xAxisScale = document.createElement('div');
  xAxisScale.classList.add('xAxisScale');

  // кнопка, которая возвращает к результатам
  const buttonToResult = document.createElement('button');
  buttonToResult.classList.add('buttonToResult');
  buttonToResult.innerHTML = 'Вернуться к результатам';
  buttonToResult.addEventListener('click', () => {
    results.classList.remove('displayNone');
    statistic.classList.toggle('displayNone');
    toStatistics.classList.toggle('displayNone');
  });

  // цифры по шкале Y
  for (let i = 1; i < 7; i += 1) {
    const numeralsY = document.createElement('p');
    numeralsY.classList.add('numeralsY');
    numeralsY.innerHTML = i * 5;
    yAxisScale.append(numeralsY);
  }

  // цифры по шкале X
  for (let i = 0; i < 11; i += 1) {
    const numeralsX = document.createElement('p');
    numeralsX.classList.add('numeralsX');
    numeralsX.innerHTML = i;
    xAxisScale.append(numeralsX);
  }

  // массив значений для графика
  const points = [{ x: 0, y: 300 }];

  // массив значений из localStorage
  const correctAnswers = localStorage.getItem('savannah').slice(0, -1).split(',');

  // перебор массива из localStorage и добаление элементов в массив для графика
  correctAnswers.forEach((el, i) => {
    points.push({
      x: points[i].x + 25,
      y: 300 - el * 10,
    });
  });

  // анимирование канваса
  animate(createCoords(points), 1, ctx);
  if (correctAnswers.length > 10) localStorage.removeItem('savannah');
  statisticScale.append(buttonToResult);
  statisticScale.append(canvasScale);
  statisticScale.append(yAxisScale);
  statisticScale.append(xAxisScale);
  statistic.append(statisticScale);

  return statistic;
};
