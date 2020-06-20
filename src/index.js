import 'components/styles/style.css';

document.querySelector('.settings-img').src = require('./components/img/settings.png').default;
document.querySelector('.games-close-img').src = require('./components/img/close.png').default;
document.querySelector('.settings-close-img').src = require('./components/img/close.png').default;

document.querySelector('.settings').addEventListener('click', () => {
	document.querySelector('.st').classList.toggle('hidden');
	document.querySelector('#translation').checked = 'checked';
	document.querySelector('#new-words').value = '';
	document.querySelector('#cards-words').value = '';
	document.querySelector('.gm').classList.add('hidden');
})

document.querySelector('.settings-button').addEventListener('click', () => {
	const len = document.querySelectorAll('.m-check:checked').length;
	if(len < 1) {
		alert('Выберите хотя бы один главный главный пункт информации на карточке!');
	}
})

document.querySelector('.games-close-img').addEventListener('click', () => {
	document.querySelector('.gm').classList.add('hidden');
})

document.querySelector('.settings-close-img').addEventListener('click', () => {
	document.querySelector('.st').classList.add('hidden');
})

document.querySelector('.games').addEventListener('click', () => {
	document.querySelector('.gm').classList.toggle('hidden');
})