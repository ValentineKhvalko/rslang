const scrSound = 'https://raw.githubusercontent.com/ValentineKhvalko/rslang-data/master/';

const createSelectedAnswerLi = (infoAboutWord) => {
  const li = document.createElement('li');
  const p = document.createElement('p');
  const voice = document.createElement('img');
  voice.src = require('@assets/img/voice.jpg').default;
  voice.classList.add('voice');
  voice.addEventListener('click', () => new Audio(scrSound + infoAboutWord.audio).play());
  p.innerHTML = infoAboutWord.word;

  li.append(voice);
  li.append(p);

  return li;
};

export default createSelectedAnswerLi;
