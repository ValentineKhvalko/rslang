import './style.scss';
import { createStatisticBlock } from './unists/statistic';
import shuffle from './unists/shuffle';
import createSelectedAnswerLi from './unists/createSelectedAnswerLi';

const randomPage = () => Math.floor(Math.random() * 30);

class Savannah {
  constructor(elem, getWords) {
    this.elem = elem;
    this.getWords = getWords;
    this.hp = 5;
    this.difficulty = 4;
    this.roundDuration = 60;
    this.groupOfDifficulty = 0;
    this.arrOfObjWords = [];
    this.entererdWords = [];
    this.correctAnswers = [];
    this.incorrectAnswers = [];
    this.groupsOfDifficulty = ['I', 'II', 'III', 'IV', 'V', 'VI'];
    this.isFinish = false;
    this.isClicked = false;
    this.timerOfGame = '';
    this.infoAboutWord = '';
    this.oneSecInterval = '';
    this.nextWordTimeout = '';
  }

  mount() {
    this.elem.classList.add('savannah');

    // Сложность игры
    const difficultyBlock = document.createElement('div');
    difficultyBlock.classList.add('difficultyBlock');
    difficultyBlock.innerHTML = 'Выберете сложность игры:';

    const select = document.createElement('select');
    select.classList.add('select');

    this.groupsOfDifficulty.forEach((difficulty) => {
      const option = document.createElement('option');
      option.value = difficulty;
      option.innerText = difficulty;
      select.append(option);
    });

    select.value = this.groupsOfDifficulty[this.groupOfDifficulty];

    select.addEventListener('click', (e) => {
      const newGroupDifficulty = this.groupsOfDifficulty.indexOf(e.target.value);
      if (this.groupOfDifficulty !== newGroupDifficulty) {
        this.groupOfDifficulty = newGroupDifficulty;
      }
    });

    difficultyBlock.append(select);

    // Кнопка старта игры и отсчет таймера
    const startButton = document.createElement('button');
    startButton.innerText = 'Start';
    startButton.classList.add('Button');
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

    // Правила игры
    const rulesOfGame = document.createElement('div');
    rulesOfGame.classList.add('rulesOfGame');
    rulesOfGame.innerHTML = `
    После отсчета стартовых секунд перед тобой появится слово на английском и четыре варианта перевода.<br />
    Каждое слово показывается лишь 5 секунд.<br /> 
    Выбирай правильные слова и не теряй очки здоровья.<br /> 
    Раунд длится 60 секунд.
  `;

    // Вставка элементов
    this.elem.append(difficultyBlock);
    this.elem.append(startButton);
    this.elem.append(rulesOfGame);
  }

  async start() {
    this.elem.classList.remove('savannah');
    this.elem.classList.add('savannah_game');

    // Очки здоровья
    const hp = document.createElement('div');
    hp.classList.add('hp');

    for (let i = 0; i < this.hp; i += 1) {
      const oneHp = document.createElement('img');
      oneHp.src = require('@assets/img/hp.png').default;
      oneHp.classList.add('oneHp');
      hp.append(oneHp);
    }

    // Таймер игры
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

    // Блоки для слов
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

    // Запуск таймера игры
    this.timerOfGame = setTimeout(() => {
      clearInterval(this.oneSecInterval);
      this.finish();
    }, this.roundDuration * 1000);

    // Добавления слуаштеля нажатия на слово
    for (let i = 0; i < this.difficulty; i += 1) {
      const li = document.createElement('li');
      li.classList.add('list');
      li.addEventListener('click', checkAnswer.bind(this));
      ul.append(li);
    }
    const arrOfElementsLi = document.querySelectorAll('.list');

    // Показать угадываемое слово и варианты ответа
    const showWordAndOptions = async () => {
      currentWord.append(shadowBlock);
      shadowBlock.classList.add('animationShadowBlock');
      if (this.hp === 0) {
        this.finish();
      } else {
        this.entererdWords = [];

        if (this.arrOfObjWords.length === 0) {
          this.arrOfObjWords = await this.getWords(randomPage(), this.groupOfDifficulty);
        }

        this.isClicked = false;

        this.nextWordTimeout = setTimeout(() => {
          new Audio(require('@assets/audio/error.mp3').default).play();
          this.incorrectAnswers.push(this.infoAboutWord);
          this.hp -= 1;
          document.querySelectorAll('.oneHp')[0].remove();
          shadowBlock.remove();
          showWordAndOptions();
        }, 5000);

        this.arrOfObjWords = shuffle(this.arrOfObjWords);
        this.infoAboutWord = this.arrOfObjWords.pop();

        p.innerHTML = this.infoAboutWord.word;
        this.entererdWords.push(this.infoAboutWord);

        for (let i = 0; i < this.difficulty - 1; i += 1) {
          this.entererdWords.push(this.arrOfObjWords.pop());
        }

        shuffle(this.entererdWords).forEach((word, i) => {
          arrOfElementsLi[i].innerHTML = word.wordTranslate;
        });
      }
    };

    // Проверка ответа
    function checkAnswer(e) {
      clearTimeout(this.nextWordTimeout);
      if (this.isClicked) return;
      this.isClicked = true;
      shadowBlock.remove();

      if (e.target.innerHTML === this.infoAboutWord.wordTranslate) {
        new Audio(require('@assets/audio/correct.mp3').default).play();
        e.target.classList.add('correct');
        this.correctAnswers.push(this.infoAboutWord);
        setTimeout(() => {
          showWordAndOptions();
        }, 700);
      } else {
        new Audio(require('@assets/audio/error.mp3').default).play();
        e.target.classList.add('fail');
        arrOfElementsLi.forEach((el) => {
          if (el.innerHTML === this.infoAboutWord.wordTranslate) el.classList.add('correct');
        });
        this.incorrectAnswers.push(this.infoAboutWord);
        this.hp -= 1;
        document.querySelectorAll('.oneHp')[0].remove();
        setTimeout(() => {
          showWordAndOptions();
        }, 700);
      }

      setTimeout(() => {
        arrOfElementsLi.forEach((el) => {
          el.classList.remove('correct');
          el.classList.remove('fail');
        });
      }, 700);
    }

    showWordAndOptions();
  }

  finish() {
    clearInterval(this.oneSecInterval);
    clearTimeout(this.timerOfGame);
    clearTimeout(this.nextWordTimeout);

    this.elem.innerHTML = '';
    this.elem.classList.remove('savannah_game');

    // Блок для результатов
    const results = document.createElement('div');
    results.classList.add('s_results');

    // Ul для правельных ответов
    const correctAnswersList = document.createElement('ul');
    correctAnswersList.innerHTML = '<p>Correct Answers</p>';
    correctAnswersList.classList.add('savannah_result');
    this.correctAnswers.forEach((infoAboutWord) => {
      correctAnswersList.append(createSelectedAnswerLi(infoAboutWord));
    });
    results.append(correctAnswersList);

    // Ul для неправельных ответов
    const incorrectAnswersList = document.createElement('ul');
    incorrectAnswersList.innerHTML = '<p>Incorrect Answers</p>';
    incorrectAnswersList.classList.add('savannah_result');
    this.incorrectAnswers.forEach((infoAboutWord) => {
      incorrectAnswersList.append(createSelectedAnswerLi(infoAboutWord));
    });
    results.append(incorrectAnswersList);

    const toStartPageButton = document.createElement('button');
    toStartPageButton.classList.add('toStartPageButton');
    toStartPageButton.innerText = 'Перейти на стартовую страницу игры';

    const toStatistics = document.createElement('button');
    toStatistics.classList.add('toStatistics');
    toStatistics.innerText = 'Статистика последних игр';

    toStartPageButton.addEventListener('click', () => {
      this.elem.innerHTML = '';
      this.mount();
    });

    if (localStorage.getItem('savannah')) {
      localStorage.setItem('savannah', `${localStorage.getItem('savannah') + this.correctAnswers.length},`);
    } else {
      localStorage.setItem('savannah', `${this.correctAnswers.length},`);
    }

    // Блок с канвасом и статистикой
    const statistic = createStatisticBlock(results, toStatistics);
    statistic.classList.toggle('displayNone');

    // переход на график статистики
    toStatistics.addEventListener('click', () => {
      statistic.classList.toggle('displayNone');
      results.classList.add('displayNone');
      toStatistics.classList.toggle('displayNone');
    });

    // Вставка элементов
    this.elem.append(toStartPageButton);
    this.elem.append(toStatistics);
    this.elem.append(statistic);
    this.elem.append(results);

    // Перевод игры в стартовое состояние
    this.hp = this.difficulty + 1;
    this.correctAnswers = [];
    this.incorrectAnswers = [];
    this.roundDuration = 60;
  }

  unmount() {
    this.elem.innerHTML = '';

    clearInterval(this.oneSecInterval);
    clearTimeout(this.roundDuration);
    clearTimeout(this.nextWordTimeout);

    // Перевод игры в стартовое состояние
    this.hp = this.difficulty + 1;
    this.correctAnswers = [];
    this.incorrectAnswers = [];
    this.roundDuration = 60;
  }
}

export default Savannah;
