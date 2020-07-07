import './style.scss';

const groupsOfDifficulty = ['I', 'II', 'III', 'IV', 'V', 'VI'];
// const scrImg = 'https://raw.githubusercontent.com/ValentineKhvalko/rslang-data/master/';

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

const randomPage = () => Math.floor(Math.random() * 30);

class Savannah {
  constructor(elem, getWords, settings, user) {
    this.elem = elem;
    this.getWords = getWords;
    this.isFinish = false;
    this.groupOfDifficulty = 0;
    this.difficulty = 5;
    this.arrOfObjWords = [];
    this.word = '';
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

    rulesOfGame.innerText = 'Выбирайте правильные слова и не теряйте очки здоровья. Раунд длится 60 секунд.';
    startButton.innerText = 'Start';

    startButton.addEventListener('click', () => {
      this.elem.innerHTML = '';
      this.start();
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
    let translationRandomWord = [];

    const ul = document.createElement('ul');
    ul.classList.add('options');
    const currentWord = document.createElement('div');
    currentWord.classList.add('currentWord');

    const shadowBlock = document.createElement('div');
    shadowBlock.classList.add('shadowBlock');
    currentWord.append(shadowBlock);
    const p = document.createElement('p');
    currentWord.append(p);

    // const currentWordImg = document.createElement('img');
    // currentWordImg.classList.add('currentImg');

    // this.elem.append(currentWordImg);
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

      if (e.target.innerHTML === this.word) {
        new Audio(require('@assets/audio/correct.mp3').default).play();
        e.target.classList.add('correct');
        this.correctAnswers.push(this.word);
        setTimeout(() => {
          this.isClicked = false;
          initialGame();
        }, 700);
      } else {
        new Audio(require('@assets/audio/error.mp3').default).play();
        e.target.classList.add('fail');
        arrOfElementsLi.forEach((el) => {
          if (el.innerHTML === this.word) el.classList.add('correct');
        });
        this.failureAnswers.push(this.word);
        this.hp -= 1;
        document.querySelectorAll('.oneHp')[0].parentElement.removeChild(document.querySelectorAll('.oneHp')[0]);
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
      console.log('add class');
      // console.log('inital game');
      const shadowBlock = document.querySelectorAll('.shadowBlock')[0]; 

      // console.log(shadowBlock, 'shadowBlock')
      // if (shadowBlock) {
        // setTimeout(() => {
          shadowBlock.classList.add('animationShadowBlock');
        // }, 0)
      
      // }
  
      if (this.hp === 0) {
        this.finish();
      } else {
        this.entererdWords = [];

        if (this.arrOfObjWords.length === 0) {
          this.arrOfObjWords = await this.getWords(randomPage(), this.groupOfDifficulty);
        }

        this.nextWordTimeout = setTimeout(() => {
      
          shadowBlock.offsetWidth;
          shadowBlock.classList.remove('animationShadowBlock');
          initialGame();
        }, 3000);
        this.arrOfObjWords = shuffle(this.arrOfObjWords);
        const currentObj = this.arrOfObjWords.pop();

        this.word = currentObj.word;
        translationRandomWord = currentObj.wordTranslate;
        p.innerHTML = translationRandomWord;
        // currentWordImg.src = scrImg + currentObj.image;
        this.entererdWords.push(this.word);

        for (let i = 0; i < this.difficulty - 1; i += 1) {
          this.entererdWords.push(this.arrOfObjWords.pop().word);
        }

        console.log(this.entererdWords, 'entered');
        console.log(this.word, 'word');

        shuffle(this.entererdWords).forEach((word, i) => {
          arrOfElementsLi[i].innerHTML = word;
        });

        // currentWordImg.onload = () => {
        // };
      }
    };

    initialGame();
  }

  finish() {
    clearInterval(this.oneSecInterval);
    clearTimeout(this.roundDuration);
    clearTimeout(this.nextWordTimeout);

    this.elem.innerHTML = '';
    this.elem.classList.remove('savannah_game');
    const correctAnswersList = document.createElement('ul');
    correctAnswersList.innerHTML = 'Correct Answers';
    const failureAnswersList = document.createElement('ul');
    failureAnswersList.innerHTML = 'Wrong Answers';
    const toStartPageButton = document.createElement('button');
    toStartPageButton.classList.add('toStartPageButton');
    toStartPageButton.innerText = 'Перейти в начало';

    toStartPageButton.addEventListener('click', () => {
      this.elem.innerHTML = '';
      this.mount();
    });

    correctAnswersList.classList.add('savannah_result');
    failureAnswersList.classList.add('savannah_result');

    this.hp = this.difficulty;

    this.correctAnswers.forEach((word) => {
      const li = document.createElement('li');
      li.innerHTML = word;
      correctAnswersList.append(li);
    });

    this.failureAnswers.forEach((word) => {
      const li = document.createElement('li');
      li.innerHTML = word;
      failureAnswersList.append(li);
    });

    this.elem.append(correctAnswersList);
    this.elem.append(failureAnswersList);
    this.elem.append(toStartPageButton);

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
