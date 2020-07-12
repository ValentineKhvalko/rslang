import './components/styles/audio.scss';
import { getWords, createWordsData, selectCurrentWord } from './components/audio-call/words.js';
import { nextButton } from './components/audio-call/consts';
import { clearAudioCallLocalStorage } from './components/audio-call/helpers';

localStorage.setItem('isFirst', '1');

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

document.querySelector('.a_restart-button').addEventListener('click', (e) => {
  document.querySelector('.a_start').classList.toggle('a_hidden');
  document.querySelector('.a_results').classList.toggle('a_hidden');
});

function startGame() {
  clearAudioCallLocalStorage();
  const page = document.getElementById('a_round').value - 1;
  const group = document.getElementById('a_difficulty').value - 1;
  getWords(page, group)
    .then((data) => createWordsData(data))
    .catch((reason) => console.log(reason.message));
}
nextButton.addEventListener('click', selectCurrentWord);
document.querySelector('.a_start-button').addEventListener('click', startGame);