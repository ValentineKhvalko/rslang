import RestAPI from '../restAPI';

class SprintGame {
  constructor(timeDuration, difficulty, wordsInGame) {
    this.timeDuration = timeDuration;
    this.difficulty = difficulty;
    this.wordsInGame = wordsInGame;
    this.wordsData = [];
    this.currentIndex = 0;
    this.translationIndex = 0;
    this.points = 0;
    this.pointsPerWord = 10;
    this.answersInARow = 0;
    this.timerId = 0;
    this.statistics = [];
    this.isGame = false;
  }

  async start() {
    document.querySelector('.sprint_progress-cover').setAttribute('stroke-dashoffset', 0);
    const result = await RestAPI.getAllWords(this.difficulty);
    this.fillWordsDataAndTranslations(result);
    this.startCountdown();
  }

  stop() {
    clearInterval(this.timerId);
    this.wordsData = [];
    this.currentIndex = 0;
    this.translationIndex = 0;
    this.points = 0;
    this.pointsPerWord = 10;
    this.answersInARow = 0;
    this.timerId = 0;
    this.isGame = false;
    this.refreshPoints();
    document.querySelector('.sprint_correct-answers-in-a-row').innerHTML = '';
    document.querySelector('.sprint_countdown span').textContent = 5;
    document.querySelector('.sprint_words h3').textContent = '';
  }

  startCountdown() {
    let сountdown = 5;
    const intervalId = setInterval(() => {
      if (сountdown === 0) {
        document.querySelector('.sprint_countdown').classList.add('hidden');
        document.querySelector('.sprint_game').classList.remove('disabled');
        clearInterval(intervalId);
        this.startTimer();
        this.showNextWordData();
      }
      document.querySelector('.sprint_countdown span').textContent = сountdown;
      сountdown -= 1;
    }, 1000);
  }

  startTimer() {
    const circumference = 2 * 56 * Math.PI;
    const maxCount = this.timeDuration;
    this.isGame = true;

    this.timerId = setInterval(() => {
      if (this.timeDuration === 0) {
        clearInterval(this.timerId);
        this.showStatistics();
        this.isGame = false;
        this.stop();
      }

      document.querySelector('.sprint_timer').textContent = this.timeDuration;
      const offset = (circumference / maxCount) * this.timeDuration;
      document.querySelector('.sprint_progress-cover').setAttribute('stroke-dashoffset', offset);

      this.timeDuration -= 1;
    }, 1000);
  }

  fillWordsDataAndTranslations(data) {
    data.forEach((e) => {
      this.wordsData.push({
        id: e.id, word: e.word, translation: e.wordTranslate, audio: e.audio,
      });
    });
  }

  showNextWordData() {
    if (this.timeDuration <= 0) {
      return;
    }
    const isResultCorrect = !!Math.floor(Math.random() * Math.floor(2));
    this.currentIndex = Math.floor(Math.random() * Math.floor(300));
    this.translationIndex = this.currentIndex;
    if (isResultCorrect) {
      this.translationIndex = Math.floor(Math.random() * Math.floor(300));
    }
    document.querySelector('.sprint_words h3').textContent = `${this.wordsData[this.currentIndex].word} - ${this.wordsData[this.translationIndex].translation}`;
    document.querySelector('.sprint_audio').innerHTML = `<audio src="https://raw.githubusercontent.com/skachkova-natalia/rslang-data/master/${this.wordsData[this.currentIndex].audio}">Ваш браузер не поддерживает элемент <code>audio</code>.</audio>`;
  }

  countPoints(isButtonCorrect) {
    if (this.timeDuration <= 0 || !this.isGame) {
      return;
    }
    let className = 'wrong-answer_colored';
    if ((this.translationIndex === this.currentIndex && isButtonCorrect)
      || (this.translationIndex !== this.currentIndex && !isButtonCorrect)) {
      className = 'correct-answer_colored';
      this.sumAndShowPoints();
      if (this.pointsPerWord !== 80) {
        this.changeAndShowPointsPerWord(true);
      }
      this.refreshPoints();
      this.addWordToStatistics(true);
    } else {
      this.changeAndShowPointsPerWord(false);
      this.addWordToStatistics(false);
    }
    document.querySelector('.sprint_main-card').classList.add(className);
    setTimeout(() => {
      document.querySelector('.sprint_main-card').classList.remove(className);
    }, 300);
    this.showNextWordData();
  }

  sumAndShowPoints() {
    this.points += this.pointsPerWord;
  }

  changeAndShowPointsPerWord(isResultCorrect) {
    if (isResultCorrect) {
      if (this.answersInARow === 0) {
        document.querySelector('.sprint_correct-answers-in-a-row').innerHTML = '';
      }
      this.answersInARow += 1;

      const span = document.createElement('span');
      span.classList.add('sprint_success-icon');
      document.querySelector('.sprint_correct-answers-in-a-row').append(span);
    } else {
      this.answersInARow = 0;
      this.pointsPerWord = 10;
      document.querySelector('.sprint_correct-answers-in-a-row').innerHTML = '';
    }

    if (this.answersInARow === 4) {
      this.answersInARow = 0;
      this.pointsPerWord *= 2;
      document.querySelector('.sprint_correct-answers-in-a-row').innerHTML = '';

      const span = document.createElement('span');
      span.classList.add('sprint_checkmark-icon');
      document.querySelector('.sprint_correct-answers-in-a-row').append(span);
    }
  }

  refreshPoints() {
    document.querySelector('.sprint_score').textContent = this.points;

    document.querySelectorAll('.sprint_first-level, .sprint_second-level, .sprint_third-level, .sprint_fourth-level').forEach((e) => {
      e.classList.remove('sprint_first-level', 'sprint_second-level', 'sprint_third-level', 'sprint_fourth-level');
      if (this.pointsPerWord === 10) {
        e.classList.add('sprint_first-level');
      } else if (this.pointsPerWord === 20) {
        e.classList.add('sprint_second-level');
      } else if (this.pointsPerWord === 40) {
        e.classList.add('sprint_third-level');
      } else if (this.pointsPerWord === 80) {
        e.classList.add('sprint_fourth-level');
      }
    });

    document.querySelector('.sprint_point-per-word').textContent = `(+${this.pointsPerWord} очков за слово)`;
  }

  showStatistics() {
    document.querySelector('.sprint_statistics').classList.toggle('hidden');
    document.querySelector('.error-list').innerHTML = '';
    document.querySelector('.success-list').innerHTML = '';
    let errorsNumber = 0;
    let successNumber = 0;
    for (let i = 0; i < this.statistics.length; i += 1) {
      const p = document.createElement('p');
      p.innerHTML = `<span class="sprint_audio"><audio src="https://raw.githubusercontent.com/skachkova-natalia/rslang-data/master/${this.statistics[i].audio}">Ваш браузер не поддерживает элемент <code>audio</code>.</audio></span>${this.statistics[i].word} - ${this.statistics[i].translation}`;
      p.classList.add('sprint_layout-flex');
      if (this.statistics[i].wrong) {
        document.querySelector('.error-list').append(p);
        errorsNumber += 1;
      } else {
        document.querySelector('.success-list').append(p);
        successNumber += 1;
      }
    }
    document.querySelector('.errors-number').textContent = errorsNumber;
    document.querySelector('.success-number').textContent = successNumber;
    document.querySelectorAll('.sprint_statistics .sprint_audio').forEach((e) => e.addEventListener('click', (event) => {
      event.target.querySelector('audio').play();
    }));
  }

  addWordToStatistics(isResultCorrect) {
    const currentWord = this.wordsData[this.currentIndex];
    const foundWord = this.statistics.find((wordStatistic) => wordStatistic.id === currentWord.id);
    if (foundWord) {
      if (isResultCorrect) {
        foundWord.correct += 1;
      } else {
        foundWord.wrong += 1;
      }
    } else {
      const index = this.statistics.push(currentWord) - 1;
      if (isResultCorrect) {
        this.statistics[index].wrong = 0;
        this.statistics[index].correct = 1;
      } else {
        this.statistics[index].wrong = 1;
        this.statistics[index].correct = 0;
      }
    }
  }
}

export default SprintGame;
