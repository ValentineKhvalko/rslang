export function playAudio() {
  const sourceNumber = selectRandomNumber(JSON.parse(localStorage.getItem('a_mediaData')));
  const audio = new Audio();
  let str = '';
  str = `https://raw.githubusercontent.com/tanya-kh/rslang-data/master/files/${sourceNumber}.mp3`;
  audio.src = str;
  audio.play();
}

function selectRandomNumber(array) {
  const randomItem = array[Math.floor(Math.random() * array.length)];
  //   console.log(randomItem);
  return randomItem;
}
