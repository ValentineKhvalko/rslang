import '../components/styles/audio.scss';
import { getWords, createWordsData } from './words.js';
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

// TO DO  FIX - settings not visible
document.querySelector('.a_game-settings-link').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('.a_settings').classList.toggle('hidden');
});

function startGame() {
  localStorage.clear();
  const page = document.getElementById('a_round').value - 1;
  const group = document.getElementById('a_difficulty').value - 1;
  getWords(page, group)
    .then((data) => createWordsData(data))
    .catch((reason) => console.log(reason.message));

  // selectCurrentWord();
  // renderAnswers();
  // playAudio();
}
nextButton.addEventListener('click', startGame);
document.querySelector('.a_start-button').addEventListener('click', startGame);
const audioIcons = document.getElementsByClassName('a_audio');

for (let i = 0; i < audioIcons.length; i++) {
  audioIcons[i].addEventListener('click', playAudio);
}
