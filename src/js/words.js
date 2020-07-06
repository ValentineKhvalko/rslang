/* eslint-disable linebreak-style */
/* eslint-disable semi */
import {
  selectRandomNumber, findObjectByKey, shuffle, playAudio, findElementByText, getImage, showSoundIcon, removeFromArray,
} from './helpers.js';

import {
  answerButton, nextButton, itemsContainer, audioIcons, currentWordInfo, image, errorList, successList, successNumber, errorNumber, numbers,
} from './consts.js';

function createWord(response, i) {
  const word = {
    id: response[i].id,
    english: response[i].word,
    translation: response[i].wordTranslate,
    mediaNumber: response[i].audio.substring(6, response[i].audio.length - 4),
  }
  // console.log(word);
  return word;
}

function getMediaNumber(response, i) {
  const mediaNumber = response[i].audio.substring(6, response[i].audio.length - 4);
  return mediaNumber;
}

export async function getWords(page, group) {
  const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`;
  const response = await fetch(url);
  const data = await response.json();
  //   console.log(data);
  return data;
}

function createItem(paragClass, spanClass, number, answer) {
  const p = document.createElement('p');
  p.classList.add(paragClass);
  p.innerHTML = `<span class="${spanClass}">${number}</span> ${answer}`;

  return p;
}

function changeNumber(list) {
  const number = parseInt(list.innerText, 10);
  list.innerText = number + 1;
}

function playResultAudio() {
  const clickedIcon = event.target.parentElement.querySelector('p span');
  const clickedWord = clickedIcon.innerText;
  const words = JSON.parse(localStorage.getItem('a_words'));
  const currentWord = findObjectByKey(words, 'english', clickedWord);
  localStorage.setItem('a_currentWord', JSON.stringify(currentWord));

  // console.log(clickedIcon);
  // console.log(clickedWord);
  // console.log(currentWord);
  playAudio();
}

function addWordToResults(word, correct) {
  const div = document.createElement('div');
  const paragClass = 'a_word';
  const list = (correct === true) ? successList : errorList;
  const numberToChange = (correct === true) ? successNumber : errorNumber;
  const spanClass = 'a_result-english';
  const img = document.createElement('img');

  const soundIcons = document.getElementsByClassName('a_img-result');

  div.classList.add('a_result-item');
  img.classList.add('a_img-result');
  img.src = require('../components/img/sound.jpg').default;
  div.appendChild(img);
  div.appendChild(createItem(paragClass, spanClass, word.english, word.translation));
  list.appendChild(div);

  for (let i = 0; i < soundIcons.length; i++) {
    soundIcons[i].addEventListener('click', playResultAudio);
  }

  changeNumber(numberToChange);
}

export function selectAnswers() {
  const answers = [];
  const currentTranslation = JSON.parse(localStorage.getItem('a_currentWord')).translation;
  // console.log(currentTranslation);
  answers.push(currentTranslation);

  while (answers.length < 5) {
    const randomWord = selectRandomNumber(JSON.parse(localStorage.getItem('a_words')));
    // console.log(randomWord);
    const randomAnswer = randomWord.translation;
    if (answers.indexOf(randomAnswer) === -1) {
      answers.push(randomAnswer);
    }
  }

  shuffle(answers);
  // console.log(answers);

  return answers;
}

export function checkAnswer() {
  let correct = true;
  let clickedAnswer;
  const pressedKey = localStorage.getItem('a_pressedKey');

  if (pressedKey) {
    // console.log(pressedKey);
    clickedAnswer = itemsContainer.children[parseInt(pressedKey, 10) - 1];
  } else {
    clickedAnswer = event.target;
  }
  // console.log(`event.target${clickedAnswer}`)

  const currentWord = JSON.parse(localStorage.getItem('a_currentWord'));
  const currentTranslation = currentWord.translation;
  const currentMediaNumber = currentWord.mediaNumber;
  const chosenTranslation = clickedAnswer.innerText.substr(2);
  const mediaNumbers = JSON.parse(localStorage.getItem('a_mediaData'));

  removeFromArray(currentMediaNumber, mediaNumbers);
  image.classList.add('a_disabled');
  answerButton.classList.toggle('a_hidden');
  nextButton.classList.toggle('a_hidden');

  clickedAnswer.classList.add('a_active');
  // console.log(clickedAnswer);
  // console.log(currentTranslation);
  // console.log(chosenTranslation);

  if (currentTranslation !== chosenTranslation) {
    correct = false;
  }
  localStorage.removeItem('a_pressedKey');
  renderCorrectAnswer(correct, clickedAnswer, currentTranslation);
}

function getKey(event) {
  const pressedKey = event.key;
  // console.log(numbers);
  localStorage.setItem('a_pressedKey', pressedKey);

  if (numbers.includes(parseInt(pressedKey, 10))) {
    checkAnswer();
    // console.log(pressedKey);
  }
}

function renderWordInfo(correct) {
  const currentWord = JSON.parse(localStorage.getItem('a_currentWord'));
  const word = document.querySelector('.a_word');
  image.src = getImage();
  word.innerText = currentWord.english;
  // console.log(`One${currentWordInfo}`);
  currentWordInfo.classList.remove('a_hidden');
  addWordToResults(currentWord, correct);
}

function renderCorrectAnswer(correct, clickedAnswer, currentTranslation) {
  const items = document.querySelectorAll('.a_item');

  itemsContainer.classList.add('a_disabled');

  for (let i = 0; i < items.length; i++) {
    items[i].removeEventListener('click', checkAnswer);
  }
  const correctAnswer = findElementByText(currentTranslation, items);
  correctAnswer.classList.add('a_correct-answer');

  if (correct !== true && !clickedAnswer.classList.contains('a_answer-button')) {
    clickedAnswer.classList.add('a_wrong-answer');
  }

  renderWordInfo(correct);
  document.removeEventListener('keyup', getKey);
  // console.log(correct);
}

function renderAnswers() {
  const answers = selectAnswers();

  itemsContainer.classList.remove('a_disabled');
  image.classList.remove('a_disabled');
  itemsContainer.innerHTML = '';
  answerButton.classList.toggle('a_hidden');
  nextButton.classList.toggle('a_hidden');
  currentWordInfo.classList.add('a_hidden');
  showSoundIcon();

  document.addEventListener('keyup', getKey);

  for (let i = 0; i < answers.length; i++) {
    const spanClass = 'a_number';
    const paragClass = 'a_item';
    const item = createItem(paragClass, spanClass, i + 1, answers[i]);
    itemsContainer.appendChild(item);
  }

  playAudio();
  const items = document.querySelectorAll('.a_item');

  for (let i = 0; i < items.length; i++) {
    items[i].addEventListener('click', checkAnswer);
  }

  answerButton.addEventListener('click', checkAnswer);

  for (let i = 0; i < audioIcons.length; i++) {
    audioIcons[i].addEventListener('click', playAudio);
    audioIcons[i].style.cursor = 'pointer';
  }
}

export function selectCurrentWord() {
  const mediaNumbers = JSON.parse(localStorage.getItem('a_mediaData'));

  if (mediaNumbers.length === 0) {
    document.querySelector('.a_game').classList.toggle('a_hidden');
    document.querySelector('.a_results').classList.toggle('a_hidden');
  } else {
    const mediaNumber = selectRandomNumber(JSON.parse(localStorage.getItem('a_mediaData')));
    const words = JSON.parse(localStorage.getItem('a_words'));
    const currentWord = findObjectByKey(words, 'mediaNumber', mediaNumber);
    localStorage.setItem('a_currentWord', JSON.stringify(currentWord));
    // console.log(mediaNumber, words, currentWord);
    renderAnswers();
  }
}

function clearResults() {
  errorList.innerHTML = '';
  successList.innerHTML = '';
  successNumber.innerHTML = 0;
  errorNumber.innerHTML = 0;
}

export function createWordsData(response) {
  // console.log(response);
  const words = [];
  const mediaData = [];
  for (let i = 0; i < 10; i++) {
    words.push(createWord(response, i));
    mediaData.push(getMediaNumber(response, i));
  }
  localStorage.setItem('a_words', JSON.stringify(words));
  localStorage.setItem('a_mediaData', JSON.stringify(mediaData));
  // console.log(JSON.parse(localStorage.getItem('a_mediaData')));
  // console.log(localStorage.getItem('a_words'));
  clearResults();
  selectCurrentWord();
}
