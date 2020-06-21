import '@app/components/styles/sprint.scss';

class SprintApp {
  static init() {
    document.getElementById('sprint_start-game').addEventListener('click', () => {
      document.querySelector('.sprint_start-screen').classList.add('hidden');
      document.querySelector('.sprint_game').classList.remove('hidden');
      //SprintGame.Start();
    });
    document.getElementById('sprint_restart-game').addEventListener('click', () => {
      document.querySelector('.sprint_start-screen').classList.remove('hidden');
      document.querySelector('.sprint_game').classList.add('hidden');
    });
    document.querySelector('.sprint_settings-link').addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.sprint_settings').classList.toggle('hidden');
    });
    document.querySelector('.sprint_close-button').addEventListener('click', () => {
      document.querySelector('.sprint_settings').classList.toggle('hidden');
    });
    document.querySelector('.game-button__wrong').addEventListener('click', () => {
      document.querySelector('.sprint_main-card').classList.add('wrong-answer_colored');
      setTimeout(() => {
        document.querySelector('.sprint_main-card').classList.remove('wrong-answer_colored');
      }, 500);
    });

    let time = 60;
    const circumference = 2 * 56 * Math.PI;
    let currentCount = 1;
    const maxCount = time;
    const els = document.querySelectorAll('circle');
    Array.prototype.forEach.call(els, (el) => {
      el.setAttribute('stroke-dasharray', circumference);
    });

    const intervalId = setInterval(() => {
      document.querySelector('.sprint_timer').textContent = time;
      if (time === 0 || currentCount > 100) {
        clearInterval(intervalId);
      }
      time -= 1;

      const offset = (circumference / maxCount) * (time + 1);
      document.querySelector('.sprint_progress-cover').setAttribute('stroke-dashoffset', offset);
      currentCount += 1;
    }, 1000);
  }
}

export default SprintApp;
