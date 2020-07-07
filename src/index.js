import 'components/styles/style.css';

let token, userI;
let page, group;
let mainObj;
let numberWord;
let maxWord;
let nowWord;
let maxCards;
let delObj;
let difObj;
let studiedWord;

const synth = window.speechSynthesis;
const voices = synth.getVoices();
let sound = 0.5;

document.querySelector('#translation').checked = 'checked';

let nowDate = new Date(); // ????????

//localStorage.clear();

if(localStorage.getItem('page'))
	page = +localStorage.getItem('page');
else
	page = 0;

if(localStorage.getItem('studiedWord'))
	studiedWord = +localStorage.getItem('studiedWord');
else
	studiedWord = 0;

if(localStorage.getItem('group'))
	group = +localStorage.getItem('group');
else
	group = 0;

if(localStorage.getItem('maxCards'))
	maxCards = +localStorage.getItem('maxCards');
else
	maxCards = 10;

if(localStorage.getItem('numberWord')) {
	numberWord = +localStorage.getItem('numberWord');
	nowWord = numberWord % 20;
}
else {
	numberWord = 0;
	nowWord = 0;
}

if(localStorage.getItem('max'))
	maxWord = +localStorage.getItem('max');
else {
	maxWord = 10;
	document.querySelector('#new-words').value = 10;
	document.querySelector('#cards-words').value = 10;
}

document.querySelector('.progress').value = studiedWord;
document.querySelector('.progress').max = maxWord;
document.querySelector('.points').innerHTML = `${studiedWord}/${maxWord}`;

const getWords = async (page, group) => {
  const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`;
  const res = await fetch(url);
  const obj = await res.json();
  mainObj = obj.slice();
};

getWords(page, group);

function play() {
	if(studiedWord < maxWord) {
		if(nowWord >= 20) {
			nowWord = 0;
			if(page === 29) {
  				page = 0;
  				group++;
  			}
  			else
  				page++;
  			localStorage.setItem('page', page);
  			localStorage.setItem('group', group);
			getWords(page, group);
			setTimeout(play, 1000);
		}
		else {
  			/*for(var i = 0; i < delObj[0].paginatedResults.length; i++) {
  				if(delObj[0].paginatedResults[i]._id === mainObj[nowWord].id) {
  					numberWord++;
					nowWord++;
  					play();
  				}
  			}*/
			document.querySelector('.word').value = '';
			document.querySelector('.translation').innerHTML = mainObj[nowWord].wordTranslate;
			document.querySelector('.transcription').innerHTML = mainObj[nowWord].transcription;
			document.querySelector('.meaning').innerHTML = mainObj[nowWord].textMeaningTranslate;
			document.querySelector('.example').innerHTML = mainObj[nowWord].textExampleTranslate;
			document.querySelector('.meaning-en').innerHTML = mainObj[nowWord].textMeaning;
			document.querySelector('.example-en').innerHTML = mainObj[nowWord].textExample;
			const str = mainObj[nowWord].image.substring(6, mainObj[nowWord].audio.length - 4);
			document.querySelector('.photo').src = `https://raw.githubusercontent.com/bobroden/rslang-data/master/data/${str}.jpg`;
			check();
			console.log(mainObj[nowWord].word);
			numberWord++;
			nowWord++;
			studiedWord++;
			localStorage.setItem('numberWord', numberWord);
			localStorage.setItem('studiedWord', studiedWord);
		}
		document.querySelector('.meaning-en').classList.add('hidden');
		document.querySelector('.example-en').classList.add('hidden');
		document.querySelector('.progress').value = studiedWord;
		document.querySelector('.progress').max = maxWord;
		document.querySelector('.points').innerHTML = `${studiedWord}/${maxWord}`;
	}
	else if(studiedWord === maxWord) {
		alert('План на день завершён!');
	}
}

if(nowWord !== 0) {
	numberWord--;
	nowWord--;
}

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
	  	userI = content.userId;
	  	document.querySelector('.enter-cont').classList.add('hidden');
	  	document.querySelector('.header').classList.remove('hidden');
	  	getDeletedWords();
	  	getDiffWords();
	  	studiedWord--;
	  	setTimeout(play, 1000);
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
     loginUser({ "email": document.querySelector('.email').value, "password": document.querySelector('.password').value });
 	}
 	catch {
 		console.log('Error!');
 	}
   };

const createUserWord = async ({ userId, wordId, word }) => {
	try {
  const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${userId}/words/${wordId}`, {
    method: 'POST',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(word)
  });
  const content = await rawResponse.json();
	}
	catch {
 		console.log('Error!');
 	}
};

/*createUserWord({
  userId: "5ec993df4ca9d600178740ae",
  wordId: "5e9f5ee35eb9e72bc21af716",
  word: { "difficulty": "weak", "optional": {testFieldString: 'test', testFieldBoolean: true} }
});*/

const getUserWord = async ({ userId, wordId }) => {
  const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${userId}/words/${wordId}`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  });
  const content = await rawResponse.json();

  console.log(content);
};

/*getUserWord({
  userId: "5ec993df4ca9d600178740ae",
  wordId: "5e9f5ee35eb9e72bc21af716"
});*/

let url;
let filter;

const getAgrWords = async (userId, token) => {
  url.pathname = `users/${userId}/aggregatedWords`;
  url.searchParams.append('filter', JSON.stringify(filter));
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Accept', 'application/json');
  const response = await fetch(url, { headers });
  const data = await response.json();
  return data;
}

//getWords(user, token);

const deleteUserWord = async ({ userId, wordId }) => {
  const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${userId}/words/${wordId}`, {
    method: 'DELETE',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });
}

document.querySelector('.settings-img').src = require('./components/img/settings.png').default;
document.querySelector('.games-close-img').src = require('./components/img/close.png').default;
document.querySelector('.settings-close-img').src = require('./components/img/close.png').default;
document.querySelector('.delete-close-img').src = require('./components/img/close.png').default;
document.querySelector('.diff-close-img').src = require('./components/img/close.png').default;

document.querySelector('.settings').addEventListener('click', () => {
	document.querySelector('#new-words').value = +localStorage.getItem('max');
	document.querySelector('#cards-words').value = +localStorage.getItem('maxCards');
	document.querySelector('.st').classList.remove('hidden');
	document.querySelector('.gm').classList.add('hidden');
	document.querySelector('.dl').classList.add('hidden');
	document.querySelector('.pl').classList.add('hidden');
	document.querySelector('.df').classList.add('hidden');
})

document.querySelector('.settings-button').addEventListener('click', () => {
	const len = document.querySelectorAll('.m-check:checked').length;
	if(len < 1) {
		alert('Выберите хотя бы один главный главный пункт информации на карточке!');
	}
	else {
		if(document.querySelector('#new-words').value.trim() !== '') {
			localStorage.setItem('max', +document.querySelector('#new-words').value);
			localStorage.setItem('maxCards', +document.querySelector('#cards-words').value)
			maxWord = +document.querySelector('#new-words').value;
			document.querySelector('.st').classList.add('hidden');
			document.querySelector('.pl').classList.remove('hidden');
			check();
			//play();
		}
	}
})

function check() {
	if(document.querySelector('#translation').checked)
		document.querySelector('.translation').classList.remove('hidden');
	else
		document.querySelector('.translation').classList.add('hidden');

	if(document.querySelector('#explanation').checked)
		document.querySelector('.meaning').classList.remove('hidden');
	else
		document.querySelector('.meaning').classList.add('hidden');

	if(document.querySelector('#example').checked)
		document.querySelector('.example').classList.remove('hidden');
	else
		document.querySelector('.example').classList.add('hidden');

	if(document.querySelector('#transcription').checked)
		document.querySelector('.transcription').classList.remove('hidden');
	else
		document.querySelector('.transcription').classList.add('hidden');

	if(document.querySelector('#photo').checked)
		document.querySelector('.photo').classList.remove('hidden');
	else
		document.querySelector('.photo').classList.add('hidden');

	if(document.querySelector('#answ').checked)
		document.querySelector('.answer').classList.remove('hidden');
	else
		document.querySelector('.answer').classList.add('hidden');

	if(document.querySelector('#del').checked)
		document.querySelector('.delete').classList.remove('hidden');
	else
		document.querySelector('.delete').classList.add('hidden');

	if(document.querySelector('#slo').checked)
		document.querySelector('.sloj').classList.remove('hidden');
	else
		document.querySelector('.sloj').classList.add('hidden');

	document.querySelector('.word').style.width = `${mainObj[nowWord].word.length * 10}px`;
	document.querySelector('.error').style.width = `${mainObj[nowWord].word.length * 10}px`;
	const l = mainObj[nowWord].word.length * 10;
	document.querySelector('.error').style.left = `calc(50% - ${(mainObj[nowWord].word.length * 10) / 2 + 5}px)`;
}

document.querySelector('.games-close-img').addEventListener('click', () => {
	document.querySelector('.gm').classList.add('hidden');
	document.querySelector('.pl').classList.remove('hidden');
})

document.querySelector('.settings-close-img').addEventListener('click', () => {
	document.querySelector('.st').classList.add('hidden');
	document.querySelector('.pl').classList.remove('hidden');
})

document.querySelector('.delete-close-img').addEventListener('click', () => {
	document.querySelector('.dl').classList.add('hidden');
	document.querySelector('.pl').classList.remove('hidden');
})

document.querySelector('.diff-close-img').addEventListener('click', () => {
	document.querySelector('.df').classList.add('hidden');
	document.querySelector('.pl').classList.remove('hidden');
})

document.querySelector('.games').addEventListener('click', () => {
	document.querySelector('.gm').classList.remove('hidden');
	document.querySelector('.st').classList.add('hidden');
	document.querySelector('.dl').classList.add('hidden');
	document.querySelector('.pl').classList.add('hidden');
	document.querySelector('.df').classList.add('hidden');
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

document.querySelector('.next').addEventListener('click', () => {
	if(document.querySelector('.word').value === mainObj[nowWord - 1].word) {

			if(document.querySelector('#explanation-en').checked)
				document.querySelector('.meaning-en').classList.remove('hidden');
			else
				document.querySelector('.meaning-en').classList.add('hidden');

			if(document.querySelector('#example-en').checked)
				document.querySelector('.example-en').classList.remove('hidden');
			else
				document.querySelector('.example-en').classList.add('hidden');

		document.querySelector('.word').value = '';
		if(document.querySelector('#voice').checked) {
			audio();
			setTimeout(play, 2000);
		}
		else
			play();
		createUserWord({
  			userId: userI,
  			wordId: mainObj[nowWord - 1].id,
  			word: { "difficulty": "studied"}
  		})
	}
	else {
		error();
	}
})

document.addEventListener('keydown', e => {
	if(e.code === 'Enter') {
		if(document.querySelector('.word').value === mainObj[nowWord - 1].word) {

			if(document.querySelector('#explanation-en').checked)
				document.querySelector('.meaning-en').classList.remove('hidden');
			else
				document.querySelector('.meaning-en').classList.add('hidden');

			if(document.querySelector('#example-en').checked)
				document.querySelector('.example-en').classList.remove('hidden');
			else
				document.querySelector('.example-en').classList.add('hidden');

			document.querySelector('.word').value = '';
			if(document.querySelector('#voice').checked) {
				audio()
				setTimeout(play, 2000);
			}
			else
				play();
		}
		else {
			error();
		}
	}
})

function audio() {
	let utterThis;
	if(document.querySelector('#explanation-en').checked && document.querySelector('#example-en').checked)
		utterThis = new SpeechSynthesisUtterance(`${mainObj[nowWord - 1].word} ${document.querySelector('.meaning-en').innerHTML} ${document.querySelector('.example-en').innerHTML}`);
	else if(document.querySelector('#explanation-en').checked)
		utterThis = new SpeechSynthesisUtterance(`${mainObj[nowWord - 1].word} ${document.querySelector('.meaning-en').innerHTML}`);
	else if(document.querySelector('#example-en').checked)
		utterThis = new SpeechSynthesisUtterance(`${mainObj[nowWord - 1].word} ${document.querySelector('.example-en').innerHTML}`);
	else
		utterThis = new SpeechSynthesisUtterance(`${mainObj[nowWord - 1].word}`);

	utterThis.lang = 'en-US';
	utterThis.volume = sound;
    synth.speak(utterThis);
}

function error() {
	var p1 = document.querySelector(".word");
	var arr1 = p1.value.split("");
	var p2 = document.querySelector('.error');
	var arr2 = mainObj[nowWord - 1].word.split('');
	let s;

	if(arr1.length < arr2.length)
		s = arr1.length;
	else
		s = arr2.length

	for(var i = 0; i < s; i++) {
		if(arr1[i] !== arr2[i])
			arr2[i]="<font color=red>"+ arr2[i] + "</font>";
	}
	p2.innerHTML = arr2.join("");

	document.querySelector('.word').classList.add('hidden');
	document.querySelector('.error').classList.remove('hidden');
	setTimeout(opacity, 1000);
}

function opacity() {
	document.querySelector('.error').classList.add('inactive');
}

document.querySelector('.error').addEventListener('click', () => {
	document.querySelector('.word').value = '';
	document.querySelector('.word').classList.remove('hidden');
	document.querySelector('.error').classList.add('hidden');
})

document.querySelector('.answer').addEventListener('click', () => {
	document.querySelector('.word').value = mainObj[nowWord - 1].word;
	if(document.querySelector('#explanation-en').checked)
		document.querySelector('.meaning-en').classList.remove('hidden');
	else
		document.querySelector('.meaning-en').classList.add('hidden');

	if(document.querySelector('#example-en').checked)
		document.querySelector('.example-en').classList.remove('hidden');
	else
		document.querySelector('.example-en').classList.add('hidden');
	if(document.querySelector('#voice').checked)
		audio();
	studiedWord--;
	setTimeout(play, 2000);
})

document.querySelector('.dict').addEventListener('click', () => {
	if(document.querySelector('.dict').value === 'deleted') {
		document.querySelector('.gm').classList.add('hidden');
		document.querySelector('.st').classList.add('hidden');
		document.querySelector('.pl').classList.add('hidden');
		document.querySelector('.df').classList.add('hidden');
		document.querySelector('.dl').classList.remove('hidden');
	}
	else if(document.querySelector('.dict').value === 'difficult') {
		document.querySelector('.gm').classList.add('hidden');
		document.querySelector('.st').classList.add('hidden');
		document.querySelector('.pl').classList.add('hidden');
		document.querySelector('.dl').classList.add('hidden');
		document.querySelector('.df').classList.remove('hidden');
	}
})

document.querySelector('.delete').addEventListener('click', () => {
	const card = document.createElement('div');
    card.classList.add('card');
    const wid = document.createElement('div');
    wid.innerHTML = mainObj[nowWord - 1].id;
    wid.classList.add('hidden');
    wid.classList.add('wid');
    const wor = document.createElement('p');
    wor.innerHTML = mainObj[nowWord - 1].wordTranslate;
    wor.classList.add('card-item');
    const transc = document.createElement('p');
    transc.innerHTML = mainObj[nowWord - 1].transcription;
    transc.classList.add('card-item');
    const trans = document.createElement('p');
    trans.innerHTML = mainObj[nowWord - 1].word;
    trans.classList.add('card-item');
    const but = document.createElement('button');
    but.innerHTML = 'Восстановить';
    but.classList.add('card-item');
    but.classList.add('vos');
    card.append(wid);
    card.append(wor);
    card.append(transc);
    card.append(trans);
    card.append(but);
    document.querySelector('.delete-window').append(card);

    createUserWord({
  		userId: userI,
  		wordId: mainObj[nowWord - 1].id,
  		word: { "difficulty": "deleted"}
  	})
  	studiedWord--;
  	play();
})

const getDeletedWords = async () => {
	url = new URL('https://afternoon-falls-25894.herokuapp.com/');
	filter = {
  		userWord: {
    		difficulty: 'deleted'
  		}	
	};
  	delObj = await getAgrWords(userI, token);
  	for(var i = 0; i < delObj[0].paginatedResults.length; i++) {
  		const card = document.createElement('div');
	    card.classList.add('card');
	    const wid = document.createElement('div');
    	wid.innerHTML = delObj[0].paginatedResults[i]._id;
    	wid.classList.add('hidden');
    	wid.classList.add('wid');
	    const wor = document.createElement('p');
	    wor.innerHTML = delObj[0].paginatedResults[i].wordTranslate;
	    wor.classList.add('card-item');
	    const transc = document.createElement('p');
	    transc.innerHTML = delObj[0].paginatedResults[i].transcription;
	    transc.classList.add('card-item');
	    const trans = document.createElement('p');
	    trans.innerHTML = delObj[0].paginatedResults[i].word;
	    trans.classList.add('card-item');
	    const but = document.createElement('button');
	    but.innerHTML = 'Восстановить';
	    but.classList.add('card-item');
	    but.classList.add('vos');
	    card.append(wid);
	    card.append(wor);
	    card.append(transc);
	    card.append(trans);
	    card.append(but);
	    document.querySelector('.delete-window').append(card);
  	}
}

document.querySelector('.delete-window').addEventListener('click', (e) => {
	if(e.target.classList.contains('vos')) {
		const i = Array.from(document.querySelectorAll('.vos')).indexOf(e.target);
		deleteUserWord({userId: userI, wordId: document.querySelectorAll('.wid')[i].innerHTML});
		document.querySelectorAll('.card')[i].remove();
	}
})

document.querySelector('.diff-window').addEventListener('click', (e) => {
	if(e.target.classList.contains('vos1')) {
		const i = Array.from(document.querySelectorAll('.vos1')).indexOf(e.target);
		deleteUserWord({userId: userI, wordId: document.querySelectorAll('.wid1')[i].innerHTML});
		document.querySelectorAll('.card1')[i].remove();
	}
})

document.querySelector('.sloj').addEventListener('click', () => {
	const card = document.createElement('div');
    card.classList.add('card1');
    const wid = document.createElement('div');
    wid.innerHTML = mainObj[nowWord - 1].id;
    wid.classList.add('hidden');
    wid.classList.add('wid1');
    const wor = document.createElement('p');
    wor.innerHTML = mainObj[nowWord - 1].wordTranslate;
    wor.classList.add('card-item');
    const transc = document.createElement('p');
    transc.innerHTML = mainObj[nowWord - 1].transcription;
    transc.classList.add('card-item');
    const trans = document.createElement('p');
    trans.innerHTML = mainObj[nowWord - 1].word;
    trans.classList.add('card-item');
    const but = document.createElement('button');
    but.innerHTML = 'Восстановить';
    but.classList.add('card-item');
    but.classList.add('vos1');
    card.append(wid);
    card.append(wor);
    card.append(transc);
    card.append(trans);
    card.append(but);
    document.querySelector('.diff-window').append(card);

    createUserWord({
  		userId: userI,
  		wordId: mainObj[nowWord - 1].id,
  		word: { "difficulty": "difficult"}
  	})
  	studiedWord--;
  	play();
})

const getDiffWords = async () => {
	url = new URL('https://afternoon-falls-25894.herokuapp.com/');
	filter = {
  		userWord: {
    		difficulty: 'difficult'
  		}	
	};
  	difObj = await getAgrWords(userI, token);
  	for(var i = 0; i < difObj[0].paginatedResults.length; i++) {
  		const card = document.createElement('div');
	    card.classList.add('card1');
	    const wid = document.createElement('div');
    	wid.innerHTML = difObj[0].paginatedResults[i]._id;
    	wid.classList.add('hidden');
    	wid.classList.add('wid1');
	    const wor = document.createElement('p');
	    wor.innerHTML = difObj[0].paginatedResults[i].wordTranslate;
	    wor.classList.add('card-item');
	    const transc = document.createElement('p');
	    transc.innerHTML = difObj[0].paginatedResults[i].transcription;
	    transc.classList.add('card-item');
	    const trans = document.createElement('p');
	    trans.innerHTML = difObj[0].paginatedResults[i].word;
	    trans.classList.add('card-item');
	    const but = document.createElement('button');
	    but.innerHTML = 'Восстановить';
	    but.classList.add('card-item');
	    but.classList.add('vos1');
	    card.append(wid);
	    card.append(wor);
	    card.append(transc);
	    card.append(trans);
	    card.append(but);
	    document.querySelector('.diff-window').append(card);
  	}
}