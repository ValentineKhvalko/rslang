import '../../components/styles/audio.scss';
import { getWords, createWordsData, selectCurrentWord } from './words.js';
import { nextButton } from './consts'

document.querySelector('.a_settings-link').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('.a_settings').classList.toggle('a_hidden');
});

document.querySelector('.a_close-button').addEventListener('click', () => {
  document.querySelector('.a_settings').classList.toggle('a_hidden');
});

document.querySelector('.a_start-button').addEventListener('click', () => {
  document.querySelector('.a_start').classList.toggle('a_hidden');
  document.querySelector('.a_game').classList.toggle('a_hidden');
});

document.querySelector('.a_game-settings-link').addEventListener('click', (e) => {
  document.querySelector('.a_start').classList.toggle('a_hidden');
  document.querySelector('.a_game').classList.toggle('a_hidden');
});

document.querySelector('.a_restart_button').addEventListener('click', (e) => {
  document.querySelector('.a_start').classList.toggle('a_hidden');
  document.querySelector('.a_results').classList.toggle('a_hidden');
});

function startGame() {
  localStorage.clear();
  const page = document.getElementById('a_round').value - 1;
  const group = document.getElementById('a_difficulty').value - 1;
  getWords(page, group)
    .then((data) => createWordsData(data))
    .catch((reason) => console.log(reason.message));
}
nextButton.addEventListener('click', selectCurrentWord);
document.querySelector('.a_start-button').addEventListener('click', startGame);
