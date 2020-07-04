import '../components/styles/audio.scss';
import { getWords, createWordsData, showSoundIcon, selectCurrentWord } from './words.js';
import { playAudio } from './helpers';
import { nextButton } from './consts'

document.querySelector('.a_settings-link').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('.a_settings').classList.toggle('hidden');
});

document.querySelector('.a_close-button').addEventListener('click', () => {
  document.querySelector('.a_settings').classList.toggle('hidden');
});

document.querySelector('.a_start-button').addEventListener('click', () => {
  document.querySelector('.a_start').classList.toggle('hidden');
  document.querySelector('.a_game').classList.toggle('hidden');
});

document.querySelector('.a_game-settings-link').addEventListener('click', (e) => {
  document.querySelector('.a_start').classList.toggle('hidden');
  document.querySelector('.a_game').classList.toggle('hidden');
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
