import './components/styles/ownGame.scss';

const startOwnGameButton = document.querySelector('.start_screen_own_button');
const ownGameStartScreen = document.querySelector('.start_screen_own');
const ownGameContainer = document.querySelector('.own_game_container');
const ownGameSelectList = document.querySelector('.own_game_select_level');
const ownGameTypeOfGame = document.querySelector('.own_game_select_type_game');
const ownGameBody = document.querySelector('.own_game_body');
const ownGameAnswers = document.querySelector('.own_game_answer_container');
const ownGameHints = document.querySelector('.own_game_hints');
const ownGameLives = document.querySelector('.own_game_lives');
const ownGameOkButton = document.querySelector('.own_game_change_type');
const secondsOwnGame = document.querySelector('.own_game_sec');
const thisScoreOwnGame = document.querySelector('.this-time-score');
const ownGameCorrectAnswer = new Audio();
const ownGameIncorrectAnswer = new Audio();
const ownGameVictory = new Audio();

ownGameCorrectAnswer.src = require('@assets/audio/correct.mp3').default;
ownGameIncorrectAnswer.src = require('@assets/audio/incorrect.mp3').default;
ownGameVictory.src = require('@assets/audio/victory.mp3').default;

let ownGameAllAnswers;
let ownGameAllSentences;
let bestStatisticsOwnGame;
let chosenAnswer;
let timerOwnGame;
localStorage.setItem('isFirst', '1');

startOwnGameButton.addEventListener('click', () => {
  ownGameStartScreen.classList.add('display_none');
  ownGameContainer.classList.remove('display_none');
  getWordsToOwnGame(controllerOwnGame.level, controllerOwnGame.page);
  timerOwnGame = setInterval(setTimerOwnGame, 1000);
});
ownGameOkButton.addEventListener('click', () => {
  clearInterval(timerOwnGame);
  controllerOwnGame.level = parseFloat(ownGameSelectList.value);
  controllerOwnGame.typeOfGame = parseFloat(ownGameTypeOfGame.value);
  ownGameBody.innerHTML = '';
  ownGameAnswers.innerHTML = '';
  controllerOwnGame.lives = 5;
  controllerOwnGame.timer = 60;
  controllerOwnGame.answers = 0;
  ownGameLives.innerHTML = controllerOwnGame.lives;
  getWordsToOwnGame(controllerOwnGame.level, controllerOwnGame.page);
  timerOwnGame = setInterval(setTimerOwnGame, 1000);
});

const controllerOwnGame = {
  level: 0,
  page: 0,
  typeOfGame: 0,
  lives: 5,
  hints: 5,
  timer: 60,
  wordStart: 0,
  answers: 0,
  score: 0,
};
function doHiddenThisScore() {
  thisScoreOwnGame.style.visibility = 'hidden';
}
function setTimerOwnGame() {
  if (controllerOwnGame.timer === 0) {
    controllerOwnGame.lives -= 1;
    controllerOwnGame.timer = 60;
    ownGameLives.innerHTML = controllerOwnGame.lives;
    secondsOwnGame.innerHTML = controllerOwnGame.timer;
    if (controllerOwnGame.lives === 0) {
      endOwnGame();
    }
  } else {
    controllerOwnGame.timer -= 1;
    secondsOwnGame.innerHTML = controllerOwnGame.timer;
  }
}

async function getWordsToOwnGame(level, page) {
  const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${level}`;
  const res = await fetch(url);
  const data = await res.json();
  if (controllerOwnGame.typeOfGame === 0) {
    addWordsAndSentencesToScreenOwnGameZeroType(data);
  }
  if (controllerOwnGame.typeOfGame === 1) {
    addWordsAndSentencesToScreenOwnGameOneType(data);
  }
}

function randomSentenceOwnGame(arr) {
  const result = Math.round(Math.random() * arr.length);
  if (result <= 19 && result >= 0) {
    return result;
  }
  return randomSentenceOwnGame(arr);
}

function addWordsAndSentencesToScreenOwnGameZeroType(arr) {
  for (let i = 0; i < 5; i += 1) {
    const randomSentence = randomSentenceOwnGame(arr);
    const p = document.createElement('p');
    const answer = document.createElement('p');
    answer.innerText = arr[randomSentence].word;
    p.innerHTML = arr[randomSentence].textExample.replace(/<\s*b[^>]*>(.*?)<\s*\/\s*b>/g, `<span class='own_game_word_to_translate'>${arr[randomSentence].wordTranslate}</span>`);
    p.classList.add('own_game_p');
    p.classList.add(`${arr[randomSentence].word}`);
    answer.classList.add('own_game_answer');
    answer.style.order = Math.round(Math.random() * 5);
    ownGameBody.append(p);
    ownGameAnswers.append(answer);
  }
  addEventsToOwnGame();
}
function addWordsAndSentencesToScreenOwnGameOneType(arr) {
  for (let i = 0; i < 5; i++) {
    const randomSentence = randomSentenceOwnGame(arr);
    const p = document.createElement('p');
    const answer = document.createElement('p');
    answer.innerText = arr[randomSentence].wordTranslate.replace(' ', '_');
    const firstWord = arr[randomSentence].textMeaningTranslate.replace(/\s.*/, '');
    p.innerHTML = arr[randomSentence].textMeaningTranslate.replace(firstWord, `<span class='own_game_word_to_translate'>${arr[randomSentence].word}</span>`);
    p.classList.add('own_game_p');
    p.classList.add(`${arr[randomSentence].wordTranslate.replace(' ', '_')}`);
    answer.classList.add('own_game_answer');
    answer.style.order = Math.round(Math.random() * 5);
    ownGameBody.append(p);
    ownGameAnswers.append(answer);
  }
  addEventsToOwnGame();
}

function endOwnGame() {
  clearInterval(timerOwnGame);
  ownGameVictory.play();
  const scoreOwnGame = document.createElement('p');
  const statsOwnGame = document.createElement('div');
  const levelNamesContainerOwnGame = document.createElement('div');
  const levelStatsContainerOwnGame = document.createElement('div');
  levelNamesContainerOwnGame.setAttribute('class', 'names_score_own_game');
  levelStatsContainerOwnGame.setAttribute('class', 'stats_score_own_game');
  scoreOwnGame.setAttribute('class', 'p_score_own_game');
  scoreOwnGame.innerText = `Игра окончена. Ваш счет: ${controllerOwnGame.score}, на уровне: ${controllerOwnGame.level + 1},
    что-бы попробовать снова нажмите ОК, либо измените параметры игры и нажмите ОК. Список ваших лучших игр вы можете увидеть ниже.`;
  if (bestStatisticsOwnGame[controllerOwnGame.level] < controllerOwnGame.score) {
    bestStatisticsOwnGame[controllerOwnGame.level] = controllerOwnGame.score;
    localStorage.setItem('ownGameBestStats', JSON.stringify(bestStatisticsOwnGame));
  }
  ownGameBody.innerHTML = '';
  ownGameAnswers.innerHTML = '';
  ownGameBody.append(scoreOwnGame);
  ownGameBody.append(statsOwnGame);
  statsOwnGame.append(levelNamesContainerOwnGame);
  statsOwnGame.append(levelStatsContainerOwnGame);
  for (let i = 0; i < 6; i++) {
    const p1 = document.createElement('p');
    const p2 = document.createElement('p');
    p1.innerText = `Ур.${i + 1}`;
    p2.innerText = `${bestStatisticsOwnGame[i]}`;
    p1.setAttribute('class', 'own_game_level_score');
    p2.setAttribute('class', 'own_game_level_score');
    levelNamesContainerOwnGame.append(p1);
    levelStatsContainerOwnGame.append(p2);
  }
}
function addEventsToOwnGame() {
  ownGameAllAnswers = document.querySelectorAll('.own_game_answer');
  ownGameAllSentences = document.querySelectorAll('.own_game_p');
  ownGameAllAnswers.forEach((el) => {
    el.onclick = function () {
      ownGameAllAnswers.forEach((el) => {
        el.classList.remove('own_game_green');
      });
      el.classList.add('own_game_green');
      chosenAnswer = el.textContent;
    };
  });

  ownGameAllSentences.forEach((el) => {
    el.onclick = function () {
      if (el.classList.contains(chosenAnswer) && !el.classList.contains('question_done')) {
        if (controllerOwnGame.typeOfGame === 0) {
          el.childNodes[1].innerHTML = chosenAnswer;
        }
        if (controllerOwnGame.typeOfGame === 1) {
          el.childNodes[0].innerHTML = chosenAnswer;
        }
        chosenAnswer = undefined;
        document.querySelector('.own_game_green').remove();
        ownGameCorrectAnswer.play();
        el.classList.add('question_done');
        controllerOwnGame.answers += 1;
        controllerOwnGame.score += 1;
        thisScoreOwnGame.innerHTML = '+1';
        thisScoreOwnGame.style.visibility = 'visible';
        setTimeout(doHiddenThisScore, 500);
        if (controllerOwnGame.answers % 5 === 0) {
          controllerOwnGame.score += controllerOwnGame.timer;
          thisScoreOwnGame.innerHTML = `+${controllerOwnGame.timer + 1}`;
          thisScoreOwnGame.style.visibility = 'visible';
          setTimeout(doHiddenThisScore, 500);
          controllerOwnGame.timer = 60;
          controllerOwnGame.page += 1;
          if (controllerOwnGame.page === 30) {
            endOwnGame();
          } else {
            ownGameBody.innerHTML = '';
            ownGameAnswers.innerHTML = '';
            getWordsToOwnGame(controllerOwnGame.level, controllerOwnGame.page);
          }
        }
      } else if (!el.classList.contains(chosenAnswer) && chosenAnswer != undefined && !el.classList.contains('question_done')) {
        controllerOwnGame.lives -= 1;
        ownGameIncorrectAnswer.play();
        ownGameLives.innerHTML = controllerOwnGame.lives;
        if (controllerOwnGame.lives <= 0) {
          endOwnGame();
        }
      }
    };
  });
}
window.onload = function () {
  if (localStorage.getItem('ownGameBestStats')) {
    bestStatisticsOwnGame = JSON.parse(localStorage.getItem('ownGameBestStats'));
  } else {
    bestStatisticsOwnGame = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
  }
};
