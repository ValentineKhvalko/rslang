import { audioIcons } from './consts.js';

export function showSoundIcon() {
  for (let i = 0; i < audioIcons.length; i++) {
    audioIcons[i].src = require('../../../assets/img/sound.jpg').default;
  }
}

export function playAudio() {
  const currentWord = JSON.parse(localStorage.getItem('a_currentWord'));
  const sourceNumber = currentWord.mediaNumber;
  const myaudio = new Audio();
  const audioUrl = `https://raw.githubusercontent.com/tanya-kh/rslang-data/master/files/${sourceNumber}.mp3`;

  myaudio.src = audioUrl;
  myaudio.play();
}

export function getImage() {
  const currentWord = JSON.parse(localStorage.getItem('a_currentWord'));
  const sourceNumber = currentWord.mediaNumber;
  const imageUrl = `https://raw.githubusercontent.com/tanya-kh/rslang-data/master/files/${sourceNumber}.jpg`;

  return imageUrl;
}

export function selectRandomNumber(array) {
  const randomItem = array[Math.floor(Math.random() * array.length)];

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

export function findElementByText(searchedText, array) {
  let found;

  for (let i = 0; i < array.length; i += 1) {
    if (array[i].textContent.includes(searchedText)) {
      found = array[i];
      break;
    }
  }

  return found;
}

export function removeFromArray(searchedElement, array) {
  const index = array.indexOf(searchedElement);

  array.splice(index, 1);
  localStorage.setItem('a_mediaData', JSON.stringify(array));
}

export function clearAudioCallLocalStorage() {
  localStorage.removeItem('a_currentWord');
  localStorage.removeItem('a_mediaData');
  localStorage.removeItem('a_words');
}