import '@app/components/styles/sprint.scss';
import SprintGame from './sprintGame';

class SprintApp {
  static init() {
    document.querySelector('.sprint_timer').textContent = document.getElementById('sprint_time-duration').value;

    document.getElementById('sprint_start-game').addEventListener('click', () => {
      document.querySelector('.sprint_start-screen').classList.add('hidden');
      document.querySelector('.sprint_countdown').classList.remove('hidden');
      document.querySelector('.sprint_game').classList.remove('hidden');
      document.querySelector('.sprint_timer').textContent = document.querySelector('.sprint_time-duration').value;
      document.querySelector('.sprint_game').classList.add('disabled');
      this.sprintGame = new SprintGame(
        document.querySelector('.sprint_time-duration').value,
        document.querySelector('.sprint_difficulty').value - 1,
        'all',
      );
      this.sprintGame.start();
    });

    document.getElementById('sprint_restart-game').addEventListener('click', () => {
      this.sprintGame.stop();
      document.querySelector('.sprint_countdown').classList.remove('hidden');
      document.querySelector('.sprint_game').classList.add('disabled');
      this.sprintGame = new SprintGame(
        document.querySelector('.sprint_time-duration').value,
        document.querySelector('.sprint_difficulty').value - 1,
        'all',
      );
      this.sprintGame.start();
    });

    document.querySelector('.sprint_settings-link').addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.sprint_settings').classList.toggle('hidden');
    });
    document.querySelector('.sprint_settings__btn').addEventListener('click', () => {
      document.querySelector('.sprint_settings').classList.toggle('hidden');
      document.querySelector('.sprint_game').classList.add('disabled');
    });

    document.querySelector('.sprint_statistics__btn').addEventListener('click', () => {
      this.sprintGame.showStatistics();
    });

    document.querySelector('.sprint_back-button').addEventListener('click', () => {
      document.querySelector('.sprint_statistics').classList.toggle('hidden');
    });

    document.querySelector('.sprint_close-button').addEventListener('click', () => {
      document.querySelector('.sprint_settings').classList.toggle('hidden');
      document.querySelector('.sprint_timer').textContent = document.querySelector('.sprint_time-duration').value;
      document.querySelector('.sprint_words h3').textContent = '';
      document.querySelector('.sprint_progress-cover').setAttribute('stroke-dashoffset', 0);
      document.querySelector('.sprint_game').classList.remove('disabled');
      if (this.sprintGame) {
        this.sprintGame.stop();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.keyCode === 37) {
        this.sprintGame.countPoints(true);
      } else if (event.keyCode === 39) {
        this.sprintGame.countPoints(false);
      }
    });
    document.querySelector('.game-button__wrong').addEventListener('click', () => {
      this.sprintGame.countPoints(false);
    });
    document.querySelector('.game-button__correct').addEventListener('click', () => {
      this.sprintGame.countPoints(true);
    });

    document.querySelector('.sprint_audio').addEventListener('click', () => {
      document.querySelector('.sprint_audio audio').play();
    });
  }
}

export default SprintApp;
