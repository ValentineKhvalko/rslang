export function playAudio() {
  const currentWord = JSON.parse(localStorage.getItem('a_currentWord'));
  const sourceNumber = currentWord.mediaNumber;
  const audio = new Audio();
  let str = '';
  str = `https://raw.githubusercontent.com/tanya-kh/rslang-data/master/files/${sourceNumber}.mp3`;
  audio.src = str;
  audio.play();
}

export function selectRandomNumber(array) {
  const randomItem = array[Math.floor(Math.random() * array.length)];
  //   console.log(randomItem);
  return randomItem;
}

export function findObjectByKey(array, key, value) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
  return null;
}

export function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}
