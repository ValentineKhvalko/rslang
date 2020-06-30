/* eslint-disable linebreak-style */
/* eslint-disable semi */
import { playAudio } from './helpers';

function createWord(response, i) {
  const word = {
    id: response[i].id,
    english: response[i].word,
    translation: response[i].wordTranslate,
  }
  return word;
}

function getMediaNumber(response, i) {
  const mediaNumber = response[i].audio.substring(6, response[i].audio.length - 4);
  return mediaNumber;
}

export async function getWords(page, group) {
  const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`;
  const response = await fetch(url);
  const data = await response.json();
  //   console.log(data);
  return data;
}

export function createWordsData(response) {
  console.log(response);
  const words = [];
  const mediaData = [];
  for (let i = 0; i < 10; i++) {
    words.push(createWord(response, i));
    mediaData.push(getMediaNumber(response, i));
  }
  localStorage.setItem('a_words', words);
  localStorage.setItem('a_mediaData', JSON.stringify(mediaData));
  console.log(JSON.parse(localStorage.getItem('a_mediaData')));
  console.log(localStorage.getItem('a_words'));
  playAudio();
}
