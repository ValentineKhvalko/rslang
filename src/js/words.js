/* eslint-disable linebreak-style */
/* eslint-disable semi */
import {
  selectRandomNumber, findObjectByKey, shuffle, playAudio, findElementByText, getImage, showSoundIcon,
} from './helpers.js';

import {
  answerButton, nextButton, itemsContainer, audioIcons, currentWordInfo, image,
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

  image.removeEventListener('click', playAudio);
  image.style.cursor = 'default';

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

function renderWordInfo() {
  const currentWord = JSON.parse(localStorage.getItem('a_currentWord'));
  const word = document.querySelector('.a_word');
  image.src = getImage();
  word.innerText = currentWord.english;
  console.log(`One${currentWordInfo}`);
  currentWordInfo.classList.remove('hidden');
}

function renderCorrectAnswer(correct, clickedAnswer, currentTranslation) {
  const items = document.querySelectorAll('.a_item');

  itemsContainer.classList.add('a_disabled');

  for (let i = 0; i < items.length; i++) {
    items[i].removeEventListener('click', checkAnswer);
  }
  const correctAnswer = findElementByText(currentTranslation, items);
  correctAnswer.classList.add('a_correct-answer');

  // if (correct !== true) {
  //   if (!clickedAnswer.classList.contains('a_answer-button')) {
  //     clickedAnswer.classList.add('a_wrong-answer');
  //   }
  // }

  if (correct !== true && !clickedAnswer.classList.contains('a_answer-button')) {
    clickedAnswer.classList.add('a_wrong-answer');
  }

  renderWordInfo();
  console.log(correct);
}

function renderAnswers() {
  const answers = selectAnswers();
  itemsContainer.classList.remove('a_disabled');
  itemsContainer.innerHTML = '';
  answerButton.classList.toggle('hidden');
  nextButton.classList.toggle('hidden');
  currentWordInfo.classList.add('hidden');
  showSoundIcon();

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

  for (let i = 0; i < audioIcons.length; i++) {
    audioIcons[i].addEventListener('click', playAudio);
    audioIcons[i].style.cursor = 'pointer';
  }
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
