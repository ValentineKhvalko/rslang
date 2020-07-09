import '@app/components/styles/style.scss';
import 'reset-css';
import Savannah from './components/savannah/Savannah';

const getWords = async (page, group) => {
  const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`;
  const res = await fetch(url);
  const obj = await res.json();
  return obj;
};

const main = document.querySelector('.savannah_main');
const savannah = new Savannah(main, getWords, {});

savannah.mount();
