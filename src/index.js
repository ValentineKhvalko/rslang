import 'components/styles/style.css';

document.querySelector('.settings-img').src = require('./components/img/settings.png').default;

document.querySelector('.settings').addEventListener('click', () => {
	document.querySelector('.st').classList.toggle('hidden');
	document.querySelector('#translation').checked = 'checked';
})