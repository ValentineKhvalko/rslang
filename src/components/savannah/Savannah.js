import './style.scss';
import { createCoords, animate } from '../Statistics';

const groupsOfDifficulty = ['I', 'II', 'III', 'IV', 'V', 'VI'];
const scrSound = 'https://raw.githubusercontent.com/ValentineKhvalko/rslang-data/master/';

const shuffle = (arr) => {
  const arrCopy = [...arr];
  let j;
  let temp;
  for (let i = 0; i < arrCopy.length; i += 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arrCopy[j];
    arrCopy[j] = arrCopy[i];
    arrCopy[i] = temp;
  }

  return arrCopy;
};

const points = [{ x: 0, y: 100 }];

const createSelectedAnswerBlock = (infoAboutWord) => {
  const li = document.createElement('li');
  const p = document.createElement('p');
  const voice = document.createElement('img');
  voice.src = require('@assets/img/voice.jpg').default;
  voice.classList.add('voice');
  voice.addEventListener('click', () => new Audio(scrSound + infoAboutWord.audio).play());
  p.innerHTML = infoAboutWord.word;

  li.append(voice);
  li.append(p);

  return li;
};

const randomPage = () => Math.floor(Math.random() * 30);

class Savannah {
  constructor(elem, getWords, settings, user) {
    this.elem = elem;
    this.getWords = getWords;
    this.isFinish = false;
    this.groupOfDifficulty = 0;
    this.difficulty = 4;
    this.arrOfObjWords = [];
    this.infoAboutWord = '';
    this.entererdWords = [];
    this.hp = 5;
    this.correctAnswers = [];
    this.failureAnswers = [];
    this.roundDuration = 60;
    this.isClicked = false;

    this.timer = '';
    this.oneSecInterval = '';
    this.nextWordTimeout = '';

    this.settings = settings;
    this.user = user;
  }

  mount() {
    this.elem.classList.add('savannah');

    const rulesOfGame = document.createElement('div');
    const startButton = document.createElement('button');
    const difficultyBlock = document.createElement('div');

    rulesOfGame.classList.add('rulesOfGame');
    startButton.classList.add('startButton');
    difficultyBlock.classList.add('difficultyBlock');

    rulesOfGame.innerHTML = 'После отчета стартовых секунд перед тобой появится слово на английском и четыре варианта перевода. <br /> Выбирай правильные слова и не теряй очки здоровья. <br /> Раунд длится 60 секунд.';
    startButton.innerText = 'Start';

    let countdown = 4;
    const countdownBlock = document.createElement('div');
    countdownBlock.classList.add('countdown');

    startButton.addEventListener('click', () => {
      this.elem.innerHTML = '';
      this.elem.append(countdownBlock);
      const countdownInterval = setInterval(() => {
        countdown -= 1;
        countdownBlock.innerHTML = countdown;
      }, 1000);
      setTimeout(() => {
        clearInterval(countdownInterval);
        this.elem.innerHTML = '';
        this.start();
      }, 4000);
    });

    const select = document.createElement('select');
    select.classList.add('select');

    groupsOfDifficulty.forEach((difficulty) => {
      const option = document.createElement('option');
      option.value = difficulty;
      option.innerText = difficulty;
      select.append(option);
    });

    difficultyBlock.innerHTML = 'Выберете сложность игры:';

    select.value = groupsOfDifficulty[this.groupOfDifficulty];

    select.addEventListener('click', (e) => {
      const newGroupDifficulty = groupsOfDifficulty.indexOf(e.target.value);
      if (this.groupOfDifficulty !== newGroupDifficulty) {
        this.groupOfDifficulty = newGroupDifficulty;
      }
    });

    difficultyBlock.append(select);
    this.elem.append(difficultyBlock);
    this.elem.append(startButton);
    this.elem.append(rulesOfGame);
  }

  async start() {
    this.elem.classList.remove('savannah');
    this.elem.classList.add('savannah_game');

    const hp = document.createElement('div');
    hp.classList.add('hp');
    for (let i = 0; i < this.hp; i += 1) {
      const oneHp = document.createElement('img');
      oneHp.src = require('@assets/img/hp.png').default;
      oneHp.classList.add('oneHp');
      hp.append(oneHp);
    }

    const timerBlock = document.createElement('div');
    timerBlock.classList.add('timer');
    timerBlock.innerHTML = `00:${this.roundDuration}`;

    const stateOfGame = document.createElement('div');
    stateOfGame.classList.add('stateOfGame');

    this.arrOfObjWords = await this.getWords(randomPage(), this.groupOfDifficulty);

    this.oneSecInterval = setInterval(() => {
      this.roundDuration -= 1;
      if (this.roundDuration < 10) timerBlock.innerHTML = `00:0${this.roundDuration}`;
      else timerBlock.innerHTML = `00:${this.roundDuration}`;
    }, 1000);

    stateOfGame.append(timerBlock);
    stateOfGame.append(hp);
    this.elem.append(stateOfGame);
    let randomWord = '';

    const ul = document.createElement('ul');
    ul.classList.add('options');
    const currentWord = document.createElement('div');
    currentWord.classList.add('currentWord');
    const p = document.createElement('p');
    currentWord.append(p);
    const shadowBlock = document.createElement('div');
    shadowBlock.classList.add('shadowBlock');

    this.elem.append(currentWord);
    this.elem.append(ul);

    this.timer = setTimeout(() => {
      clearInterval(this.oneSecInterval);
      this.finish();
    }, this.roundDuration * 1000);

    async function checkAnswer(e) {
      clearTimeout(this.nextWordTimeout);
      if (this.isClicked) return false;
      this.isClicked = true;
      shadowBlock.remove();

      if (e.target.innerHTML === this.infoAboutWord.wordTranslate) {
        new Audio(require('@assets/audio/correct.mp3').default).play();
        e.target.classList.add('correct');
        this.correctAnswers.push(this.infoAboutWord);
        setTimeout(() => {
          this.isClicked = false;
          initialGame();
        }, 700);
      } else {
        new Audio(require('@assets/audio/error.mp3').default).play();
        e.target.classList.add('fail');
        arrOfElementsLi.forEach((el) => {
          if (el.innerHTML === this.infoAboutWord.wordTranslate) el.classList.add('correct');
        });
        this.failureAnswers.push(this.infoAboutWord);
        this.hp -= 1;
        document.querySelectorAll('.oneHp')[0].remove();
        setTimeout(() => {
          this.isClicked = false;
          initialGame();
        }, 700);
      }

      setTimeout(() => {
        arrOfElementsLi.forEach((el) => {
          el.classList.remove('correct');
          el.classList.remove('fail');
        });
      }, 700);
    }

    for (let i = 0; i < this.difficulty; i += 1) {
      const li = document.createElement('li');
      li.classList.add('list');
      li.addEventListener('click', checkAnswer.bind(this));
      ul.append(li);
    }

    const arrOfElementsLi = document.querySelectorAll('.list');

    const initialGame = async () => {
      currentWord.append(shadowBlock);
      shadowBlock.classList.add('animationShadowBlock');
      if (this.hp === 0) {
        this.finish();
      } else {
        this.entererdWords = [];

        if (this.arrOfObjWords.length === 0) {
          this.arrOfObjWords = await this.getWords(randomPage(), this.groupOfDifficulty);
        }

        this.nextWordTimeout = setTimeout(() => {
          new Audio(require('@assets/audio/error.mp3').default).play();
          this.failureAnswers.push(this.infoAboutWord);
          this.hp -= 1;
          document.querySelectorAll('.oneHp')[0].remove();
          shadowBlock.remove();
          initialGame();
        }, 5000);

        this.arrOfObjWords = shuffle(this.arrOfObjWords);
        this.infoAboutWord = this.arrOfObjWords.pop();
        console.log(this.infoAboutWord);

        randomWord = this.infoAboutWord.word;
        p.innerHTML = randomWord;
        this.entererdWords.push(this.infoAboutWord);

        for (let i = 0; i < this.difficulty - 1; i += 1) {
          this.entererdWords.push(this.arrOfObjWords.pop());
        }

        console.log(this.entererdWords, 'entered');
        console.log(this.infoAboutWord, 'word');

        shuffle(this.entererdWords).forEach((word, i) => {
          arrOfElementsLi[i].innerHTML = word.wordTranslate;
        });
      }
    };

    initialGame();
  }

  finish() {
    clearInterval(this.oneSecInterval);
    clearTimeout(this.timer);
    clearTimeout(this.nextWordTimeout);

    this.elem.innerHTML = '';
    this.elem.classList.remove('savannah_game');
    const results = document.createElement('div');
    results.classList.add('results');
    const correctAnswersList = document.createElement('ul');
    correctAnswersList.innerHTML = 'Correct Answers';
    const failureAnswersList = document.createElement('ul');
    failureAnswersList.innerHTML = 'Wrong Answers';
    const toStartPageButton = document.createElement('button');
    toStartPageButton.classList.add('toStartPageButton');
    toStartPageButton.innerText = 'Перейти в начало';
    const toStatistics = document.createElement('button');
    toStatistics.classList.add('toStatistics');
    toStatistics.innerText = 'toStatistics';

    toStartPageButton.addEventListener('click', () => {
      this.elem.innerHTML = '';
      this.mount();
    });

    correctAnswersList.classList.add('savannah_result');
    failureAnswersList.classList.add('savannah_result');

    this.hp = this.difficulty;

    this.correctAnswers.forEach((infoAboutWord) => {
      correctAnswersList.append(createSelectedAnswerBlock(infoAboutWord));
    });

    if (localStorage.getItem('savannah')) {
      localStorage.setItem('savannah', `${localStorage.getItem('savannah') + this.correctAnswers.length},`);
    } else {
      localStorage.setItem('savannah', `${this.correctAnswers.length},`);
    }

    console.log(localStorage.getItem('savannah').substring(0, ishodnatyaStroka.length-1).split(','));

    toStatistics.addEventListener('click', () => {
      const correctAnswers =  localStorage.getItem('savannah').substring(0, ishodnatyaStroka.length-1)
      localStorage.getItem('savannah').split(',').forEach((el, i) => {
        points.push({
          x: points[i].x + 25,
          y: 100 - el * 3,
        });
      });
      this.elem.innerHTML = '';
      const example = document.createElement('canvas');
      // example.id = 'example';
      this.elem.append(example);
      const ctx = example.getContext('2d');
      example.width = 400;
      example.height = 400;
      animate(createCoords(points), 1, ctx);
    });

    this.failureAnswers.forEach((infoAboutWord) => {
      failureAnswersList.append(createSelectedAnswerBlock(infoAboutWord));
    });

    results.append(correctAnswersList);
    results.append(failureAnswersList);
    this.elem.append(results);
    this.elem.append(toStartPageButton);
    this.elem.append(toStatistics);

    this.correctAnswers = [];
    this.failureAnswers = [];
    this.roundDuration = 60;
  }

  unmount() {
    this.elem.innerHTML = '';

    clearInterval(this.oneSecInterval);
    clearTimeout(this.roundDuration);
    clearTimeout(this.nextWordTimeout);

    this.hp = this.difficulty;
    this.correctAnswers = [];
    this.failureAnswers = [];
    this.roundDuration = 60;
  }
}

export default Savannah;
