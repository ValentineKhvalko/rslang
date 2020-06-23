import '../components/styles/audio.scss';

document.querySelector('.a_settings-link').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('.a_settings').classList.toggle('hidden');
});

document.querySelector('.a_close-button').addEventListener('click', () => {
  document.querySelector('.a_settings').classList.toggle('hidden');
});

// function Redirect() {
//   window.location.href = '/audio.html';
// }

// document.getElementById('a-button').addEventListener('click', Redirect);
