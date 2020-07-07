import '@app/components/styles/style.scss';
import 'reset-css';
import Savannah from './components/savannah/Savannah';

const getWords = async (page, group) => {
  const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`;
  const res = await fetch(url);
  const obj = await res.json();
  return obj;
};

const main = document.querySelector('.main');

const savannah = new Savannah(main, getWords, {});

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

savannah.mount();
