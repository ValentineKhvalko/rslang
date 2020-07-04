import { audioIcons } from './consts.js';

// function showSoundOnIcon() {
//   for (let i = 0; i < audioIcons.length; i++) {
//     audioIcons[i].src = require('../components/img/soundOn.gif').default;
//   }
// }

export function showSoundIcon() {
  for (let i = 0; i < audioIcons.length; i++) {
    audioIcons[i].src = require('../components/img/sound.jpg').default;
  }
}

// function soundEnd() {
//   alert('end');
// }

// for (let i = 0; i < audioIcons.length; i++) {
//   audioIcons[i].addEventListener('ended', showSoundIcon);
// }

export function playAudio() {
  const currentWord = JSON.parse(localStorage.getItem('a_currentWord'));
  const sourceNumber = currentWord.mediaNumber;
  const myaudio = new Audio();
  // const myaudio = document.createElement('audio');
  const audioUrl = `https://raw.githubusercontent.com/tanya-kh/rslang-data/master/files/${sourceNumber}.mp3`;
  myaudio.src = audioUrl;
  // showSoundOnIcon();
  myaudio.play();

  // const audioHtml = document.getElementById('myaudio');
  // console.log(audioHtml);
  // audioHtml.addEventListener('ended', soundEnd);
}

export function getImage() {
  const currentWord = JSON.parse(localStorage.getItem('a_currentWord'));
  const sourceNumber = currentWord.mediaNumber;
  const imageUrl = `https://raw.githubusercontent.com/tanya-kh/rslang-data/master/files/${sourceNumber}.jpg`;
  return imageUrl;
}

export function selectRandomNumber(array) {
  const randomItem = array[Math.floor(Math.random() * array.length)];
  //   console.log(randomItem);
  return randomItem;
}

export function findObjectByKey(array, key, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
  return null;
}

export function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

export function findElementByText(searchedText, elementArray) {
  let found;

  for (let i = 0; i < elementArray.length; i++) {
    if (elementArray[i].textContent.includes(searchedText)) {
      found = elementArray[i];
      break;
    }
  }
  console.log(`Answer${found}`);
  return found;
}
