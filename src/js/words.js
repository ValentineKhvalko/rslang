/* eslint-disable linebreak-style */
/* eslint-disable semi */
import {
  selectRandomNumber, findObjectByKey, shuffle, playAudio, findElementByText,
} from './helpers.js';

import { answerButton, nextButton, itemsContainer } from './consts.js';

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

function createItem(number, answer) {
  const p = document.createElement('p');
  p.classList.add('a_item');
  p.innerHTML = `<span class="a_number">${number}</span>${answer}`;

  return p;
}

export function selectAnswers() {
  const answers = [];
  const currentTranslation = JSON.parse(localStorage.getItem('a_currentWord')).translation;
  console.log(currentTranslation);
  answers.push(currentTranslation);

  while (answers.length < 5) {
    const randomWord = selectRandomNumber(JSON.parse(localStorage.getItem('a_words')));
    console.log(randomWord);
    const randomAnswer = randomWord.translation;
    if (answers.indexOf(randomAnswer) === -1) {
      answers.push(randomAnswer);
    }
  }

  shuffle(answers);
  console.log(answers);

  return answers;
}

export function checkAnswer() {
  let correct = true;
  const clickedAnswer = event.target;
  const currentTranslation = JSON.parse(localStorage.getItem('a_currentWord')).translation;
  const chosenTranslation = clickedAnswer.innerText.substr(1);

  answerButton.classList.toggle('hidden');
  nextButton.classList.toggle('hidden');

  clickedAnswer.classList.add('a_active');
  console.log(clickedAnswer);

  console.log(currentTranslation);

  console.log(chosenTranslation);

  if (currentTranslation !== chosenTranslation) {
    correct = false;
  }

  renderCorrectAnswer(correct, clickedAnswer, currentTranslation);
}

function renderCorrectAnswer(correct, clickedAnswer, currentTranslation) {
  const items = document.querySelectorAll('.a_item');

  itemsContainer.classList.add('a_disabled');

  for (let i = 0; i < items.length; i++) {
    items[i].removeEventListener('click', checkAnswer);
  }
  const correctAnswer = findElementByText(currentTranslation, items);
  correctAnswer.classList.add('a_correct-answer');

  if (correct !== true) {
    clickedAnswer.classList.add('a_wrong-answer');
  }

  console.log(correct);
}

function renderAnswers() {
  const answers = selectAnswers();
  itemsContainer.classList.remove('a_disabled');
  itemsContainer.innerHTML = '';
  answerButton.classList.toggle('hidden');
  nextButton.classList.toggle('hidden');

  for (let i = 0; i < answers.length; i++) {
    const item = createItem(i + 1, answers[i]);
    itemsContainer.appendChild(item);
  }

  playAudio();
  const items = document.querySelectorAll('.a_item');

  for (let i = 0; i < items.length; i++) {
    items[i].addEventListener('click', checkAnswer);
  }

  answerButton.addEventListener('click', checkAnswer);
}

export function selectCurrentWord() {
  const mediaNumber = selectRandomNumber(JSON.parse(localStorage.getItem('a_mediaData')));
  const words = JSON.parse(localStorage.getItem('a_words'));
  const currentWord = findObjectByKey(words, 'mediaNumber', mediaNumber);
  localStorage.setItem('a_currentWord', JSON.stringify(currentWord));
  console.log(mediaNumber, words, currentWord);
  renderAnswers();
}

export function createWordsData(response) {
  console.log(response);
  const words = [];
  const mediaData = [];
  for (let i = 0; i < 10; i++) {
    words.push(createWord(response, i));
    mediaData.push(getMediaNumber(response, i));
  }
  localStorage.setItem('a_words', JSON.stringify(words));
  localStorage.setItem('a_mediaData', JSON.stringify(mediaData));
  console.log(JSON.parse(localStorage.getItem('a_mediaData')));
  console.log(localStorage.getItem('a_words'));
  selectCurrentWord();
}
