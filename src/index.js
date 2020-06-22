import 'components/styles/style.css';

let token, user;
let page, group;

if(localStorage.getItem('page'))
	page = +localStorage.getItem('page');
else
	page = 0;

if(localStorage.getItem('group'))
	group = +localStorage.getItem('group');
else
	group = 0;

const loginUser = async user => {
	try {
	  const rawResponse = await fetch('https://afternoon-falls-25894.herokuapp.com/signin', {
	    method: 'POST',
	    headers: {
	      'Accept': 'application/json',
	      'Content-Type': 'application/json'
	    },
	    body: JSON.stringify(user)
	  });
	  const content = await rawResponse.json();
	  if(content.message === 'Authenticated') {
	  	token = content.token;
	  	user = content.userId;
	  	document.querySelector('.enter-cont').classList.add('hidden');
	  	document.querySelector('.header').classList.remove('hidden');
	  }
	}
	catch {
		console.log('Error!');
	}
};

const createUser = async user => {
	try {
     const rawResponse = await fetch('https://afternoon-falls-25894.herokuapp.com/users', {
       method: 'POST',
       headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
       },
       body: JSON.stringify(user)
     });
     const content = await rawResponse.json();
 	}
 	catch {
 		console.log('Error!');
 	}
   };

document.querySelector('.settings-img').src = require('./components/img/settings.png').default;
document.querySelector('.games-close-img').src = require('./components/img/close.png').default;
document.querySelector('.settings-close-img').src = require('./components/img/close.png').default;

document.querySelector('#new-words').value = '10';
document.querySelector('#cards-words').value = '10';

document.querySelector('.settings').addEventListener('click', () => {
	document.querySelector('.st').classList.toggle('hidden');
	document.querySelector('#translation').checked = 'checked';
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
	document.querySelector('.st').classList.add('hidden');
})

function equal() {
	let a = +document.querySelector('#new-words').value;
	if(document.querySelector('#new-words').value.trim() === '')
		a = 0;
	let b = +document.querySelector('#cards-words').value
	if(document.querySelector('#cards-words').value.trim() === '')
		b = 0;
	if(a > b)
		a = b;
	document.querySelector('#new-words').value = a;
	document.querySelector('#cards-words').value = b;
}

document.querySelector('#new-words').addEventListener('change', equal);
document.querySelector('#cards-words').addEventListener('change', equal);

document.querySelector('.in').addEventListener('click', () => {
	if(document.querySelector('.begin').checkValidity()) {
		if(document.querySelector('#enter').checked === true)
			loginUser({ "email": document.querySelector('.email').value, "password": document.querySelector('.password').value });
		else if(document.querySelector('#reg').checked === true)
			createUser({ "email": document.querySelector('.email').value, "password": document.querySelector('.password').value });
	}
})


/*const getWords = async (page, group) => {
  const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`;
  const res = await fetch(url);
  const obj = await res.json();
  let words = +document.querySelector('#new-words').value;
  let cards = +document.querySelector('#cards-words').value;
};*/