import './components/styles/speak-it.scss';

document.querySelector('.img').src = require('../assets/img/blank.jpg').default;

localStorage.setItem('isFirst', '1');

let page = Math.round(-0.5 + Math.random() * (29 + 1));
let group = 0;
let maxNum = 0;
const audio_icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                      <path fill="currentColor" d="M15.788 13.007a3 3 0 110 5.985c.571 3.312 2.064 5.675 3.815 5.675 2.244 0 4.064-3.88 4.064-8.667 0-4.786-1.82-8.667-4.064-8.667-1.751 0-3.244 2.363-3.815 5.674zM19 26c-3.314 0-12-4.144-12-10S15.686 6 19 6s6 4.477 6 10-2.686 10-6 10z" fill-rule="evenodd"></path>
                    </svg>`;
const img = document.querySelector('.img');
img.src = require('../assets/img/blank.jpg').default;

const trans = document.querySelector('.trans');
const input = document.querySelector('.input');
const table = document.querySelector('.table');
let arrOfSrc = [];
let arrOfSrcErr = [];
let arrOfSrcSuc = [];
let maxArr = [];
const score = document.querySelector('.score');
let dates = [];
let suc = [];
let err = [];
let mx = [];
let date = new Date();
if (!localStorage.getItem('dates')) {
  dates = [];
  suc = [];
  err = [];
  mx = [];
} else {
  dates = localStorage.getItem('dates').split(',');
  suc = localStorage.getItem('suc').split(',');
  err = localStorage.getItem('err').split(',');
  mx = localStorage.getItem('mx').split(',');
  locale(1);
}

function maxOfArr(arr) {
  if (arr.length === 0) return 0;
  let t = arr[0];
  for (let i = 0; i < arr.length; i += 1) {
    if (t < arr[i]) t = arr[i];
  }
  return t;
}

const getWords = async (page, group) => {
  arrOfSrc = [];
  const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`;
  const res = await fetch(url);
  const obj = await res.json();
  document.querySelector('.items').innerHTML = '';
  document.querySelector('.error-list').innerHTML = '';
  document.querySelector('.succes-list').innerHTML = '';
  arrOfSrc = [];
  arrOfSrcErr = [];
  arrOfSrcSuc = [];
  for (let i = 0; i < 10; i += 1) {
    const str = obj[i].audio.substring(6, obj[i].audio.length - 4);
    arrOfSrc.push(str);
    const item = document.createElement('div');
    item.classList.add('item');
    const audio_container = document.createElement('span');
    audio_container.classList.add('audio-icon');
    audio_container.innerHTML = audio_icon;
    const word = document.createElement('p');
    word.classList.add('word');
    const transcription = document.createElement('p');
    transcription.classList.add('transcription');
    word.innerHTML = obj[i].word;
    transcription.innerHTML = obj[i].transcription;
    item.append(audio_container);
    item.append(word);
    item.append(transcription);
    document.querySelector('.items').append(item);
    const resul = item.cloneNode(true);
    const translation = document.createElement('p');
    translation.classList.add('tr');
    resul.append(translation);
    document.querySelector('.error-list').append(resul);
    getTranslation(1, obj[i].word, i);
  }
  arrOfSrc.forEach((item) => {
    arrOfSrcErr.push(item);
  });
};

document.querySelector('.point').classList.add('activePoint');
getWords(page, group);

document.querySelector('.start-button').addEventListener('click', () => {
  document.querySelector('.start').classList.add('hidden');
  document.querySelector('.main').classList.remove('hidden');
});

async function getTranslation(n, str, i = -1) {
  const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200424T141504Z.32a093fabf8b0339.7bde940027a55e01938276e0391985ac1f48c49c&text=${str}&lang=en-ru`;
  const res = await fetch(url);
  const data = await res.json();
  if (n === 0) { document.querySelector('.trans').innerHTML = data.text; } else { document.querySelectorAll('.tr')[i].innerHTML = data.text; }
}

function train(e) {
  if (e.target.parentElement.classList.contains('item') || e.target.classList.contains('item')) {
    document.querySelectorAll('.items .item').forEach((item) => {
      item.classList.remove('activeItem');
    });
    let i = 0;
    if (!e.target.classList.contains('item')) {
      i = Array.from(document.querySelector('.items').children).indexOf(e.target.parentElement);
      e.target.parentElement.classList.add('activeItem');
    } else {
      i = Array.from(document.querySelectorAll('.item')).indexOf(e.target);
      e.target.classList.add('activeItem');
    }
    const audio = new Audio();
    let str = '';
    str = `https://raw.githubusercontent.com/bobroden/rslang-data/master/data/${arrOfSrc[i]}.mp3`;
    audio.src = str;
    audio.play();
    str = `https://raw.githubusercontent.com/bobroden/rslang-data/master/data/${arrOfSrc[i]}.jpg`;
    img.setAttribute('src', str);
    getTranslation(0, document.querySelectorAll('.item .word')[i].innerHTML);
  }
}

document.querySelector('.items').addEventListener('click', train);

const recognizer = new webkitSpeechRecognition();
recognizer.interimResults = true;
recognizer.lang = 'en-En';

recognizer.addEventListener('result', (event) => {
  const result = event.results[event.resultIndex];
  if (result.isFinal) {
    let str = result[0].transcript;
    input.value = str.toLowerCase();
    recognizer.stop();
    const t = maxNum;
    for (let i = 0; i < document.querySelector('.items').children.length; i += 1) {
      if (document.querySelectorAll('.item .word')[i].innerHTML === input.value && !document.querySelectorAll('.item')[i].classList.contains('activeItem')) {
        str = `https://raw.githubusercontent.com/bobroden/rslang-data/master/data/${arrOfSrc[i]}.jpg`;
        img.setAttribute('src', str);
        document.querySelectorAll('.item')[i].classList.add('activeItem');
        const div = document.createElement('div');
        div.classList.add('star');
        maxNum += 1;
        const im = document.createElement('img');
        im.src = require('../assets/img/star.svg').default;
        div.append(im);
        score.append(div);
        for (let j = 0; j < document.querySelector('.error-list').children.length; j += 1) {
          if (document.querySelectorAll('.item .word')[i].innerHTML === document.querySelectorAll('.error-list .item .word')[j].innerHTML) {
            arrOfSrcSuc.push(arrOfSrcErr.splice(j, 1));
            const clone = document.querySelector('.error-list').children[j];
            document.querySelector('.succes-list').append(clone);
            if (document.querySelector('.error-list').children[j]) { document.querySelector('.error-list').children[j].remove; }
            let err = +document.querySelector('.errors-num').innerHTML;
            err -= 1;
            document.querySelector('.errors-num').innerHTML = err;
            let suc = +document.querySelector('.succes-num').innerHTML;
            suc += 1;
            document.querySelector('.succes-num').innerHTML = suc;
          }
        }
      }
    }
    if (t === maxNum) {
      maxArr.push(maxNum);
      maxNum = 0;
    }
  }
});

function speach() {
  recognizer.start();
}
let k = false;

document.querySelector('.speak').addEventListener('click', (e) => {
  if (!k) {
    document.querySelectorAll('.items .item').forEach((item) => {
      item.classList.remove('activeItem');
    });
  }
  trans.classList.add('hidden');
  input.classList.remove('hidden');
  document.querySelector('.items').removeEventListener('click', train);
  recognizer.start();
  recognizer.addEventListener('end', speach);
  k = true;
});

document.querySelector('.result').addEventListener('click', () => {
  document.querySelector('.main').classList.add('hidden');
  document.querySelector('.statisc').classList.add('hidden');
  document.querySelector('.results').classList.remove('hidden');
});

document.querySelector('.error-list').addEventListener('click', (e) => {
  if (e.target.parentElement.classList.contains('item') || e.target.classList.contains('item')) {
    document.querySelectorAll('.results-container .item').forEach((item) => {
      item.classList.remove('activeItem');
    });
    let i = 0;
    if (!e.target.classList.contains('item')) {
      i = Array.from(document.querySelector('.error-list').children).indexOf(e.target.parentElement);
      e.target.parentElement.classList.add('activeItem');
    } else {
      i = Array.from(document.querySelector('.error-list').children).indexOf(e.target);
      e.target.classList.add('activeItem');
    }
    const audio = new Audio();
    let str = '';
    str = `https://raw.githubusercontent.com/bobroden/rslang-data/master/data/${arrOfSrcErr[i]}.mp3`;
    audio.src = str;
    audio.play();
  }
});

document.querySelector('.succes-list').addEventListener('click', (e) => {
  if (e.target.parentElement.classList.contains('item') || e.target.classList.contains('item')) {
    document.querySelectorAll('.results-container .item').forEach((item) => {
      item.classList.remove('activeItem');
    });
    let i = 0;
    if (!e.target.classList.contains('item')) {
      i = Array.from(document.querySelector('.succes-list').children).indexOf(e.target.parentElement);
      e.target.parentElement.classList.add('activeItem');
    } else {
      i = Array.from(document.querySelector('.succes-list').children).indexOf(e.target);
      e.target.classList.add('activeItem');
    }
    const audio = new Audio();
    let str = '';
    str = `https://raw.githubusercontent.com/bobroden/rslang-data/master/data/${arrOfSrcSuc[i]}.mp3`;
    audio.src = str;
    audio.play();
  }
});

document.querySelector('.return').addEventListener('click', () => {
  document.querySelector('.results').classList.add('hidden');
  document.querySelector('.main').classList.remove('hidden');
});

document.querySelector('.new-game').addEventListener('click', () => {
  date = new Date();
  locale();
  recognizer.removeEventListener('end', speach);
  recognizer.stop();
  k = false;
  document.querySelector('.results').classList.add('hidden');
  document.querySelector('.main').classList.remove('hidden');
  input.classList.add('hidden');
  trans.classList.remove('hidden');
  trans.innerHTML = '';
  img.setAttribute('src', '../assets/img/blank.jpg');
  document.querySelector('.errors-num').innerHTML = 10;
  document.querySelector('.succes-num').innerHTML = 0;
  document.querySelector('.score').innerHTML = '';
  document.querySelector('.items').addEventListener('click', train);
  page = Math.round(-0.5 + Math.random() * (29 + 1));
  getWords(page, group);
});

document.querySelector('.restart').addEventListener('click', () => {
  recognizer.removeEventListener('end', speach);
  recognizer.stop();
  if (k === true) {
    date = new Date();
    locale();
  }
  k = false;
  input.classList.add('hidden');
  trans.classList.remove('hidden');
  trans.innerHTML = '';
  img.setAttribute('src', '../assets/img/blank.jpg');
  document.querySelector('.errors-num').innerHTML = 10;
  document.querySelector('.succes-num').innerHTML = 0;
  document.querySelector('.score').innerHTML = '';
  document.querySelector('.items').addEventListener('click', train);
  getWords(page, group);
});

document.querySelector('.points').addEventListener('click', (e) => {
  if (e.target.classList.contains('point')) {
    document.querySelectorAll('.point').forEach((item) => {
      item.classList.remove('activePoint');
    });
    if (k === true) {
      date = new Date();
      locale();
    }
    e.target.classList.add('activePoint');
    group = Array.from(document.querySelectorAll('.point')).indexOf(e.target);
    document.querySelector('.results').classList.add('hidden');
    document.querySelector('.main').classList.remove('hidden');
    input.classList.add('hidden');
    trans.classList.remove('hidden');
    trans.innerHTML = '';
    img.setAttribute('src', '../assets/img/blank.jpg');
    document.querySelector('.errors-num').innerHTML = 10;
    document.querySelector('.succes-num').innerHTML = 0;
    document.querySelector('.score').innerHTML = '';
    document.querySelector('.items').addEventListener('click', train);
    page = Math.round(-0.5 + Math.random() * (29 + 1));
    getWords(page, group);
  }
});

// statistics

document.querySelector('.statistics').addEventListener('click', () => {
  document.querySelector('.statisc').classList.remove('hidden');
  document.querySelector('.results').classList.add('hidden');
});

document.querySelector('.result-back').addEventListener('click', () => {
  document.querySelector('.statisc').classList.add('hidden');
  document.querySelector('.results').classList.remove('hidden');
});
function locale(s = 0) {
  if (s === 1) {
    for (let i = 0; i < suc.length; i += 1) {
      table.innerHTML += '<tr><td></td><td></td><td></td><td></td><td></td></tr>';
      table.rows[i + 1].cells[0].innerHTML = dates[i];
      table.rows[i + 1].cells[1].innerHTML = suc[i];
      table.rows[i + 1].cells[2].innerHTML = err[i];
      table.rows[i + 1].cells[3].innerHTML = `${+suc[i] * 10}%`;
      table.rows[i + 1].cells[4].innerHTML = mx[i];
    }
  } else {
    if (suc.length === 10) {
      dates.shift();
      suc.shift();
      err.shift();
      mx.shift();
      table.deleteRow(1);
    }
    dates.push(`${date.getHours()}:${date.getMinutes()}; ${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`);
    suc.push(document.querySelector('.succes-num').innerHTML);
    err.push(document.querySelector('.errors-num').innerHTML);
    mx.push(maxOfArr(maxArr));
    maxArr = [];
    table.innerHTML += '<tr><td></td><td></td><td></td><td></td><td></td></tr>';
    table.rows[suc.length].cells[0].innerHTML = dates[suc.length - 1];
    table.rows[suc.length].cells[1].innerHTML = suc[suc.length - 1];
    table.rows[suc.length].cells[2].innerHTML = err[suc.length - 1];
    table.rows[suc.length].cells[3].innerHTML = `${+suc[suc.length - 1] * 10}%`;
    table.rows[suc.length].cells[4].innerHTML = mx[suc.length - 1];
  }
  localStorage.setItem('dates', dates);
  localStorage.setItem('suc', suc);
  localStorage.setItem('err', err);
  localStorage.setItem('mx', mx);
}
