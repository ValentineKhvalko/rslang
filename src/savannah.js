import 'reset-css';

import Savannah from './components/savannah/Savannah';
import getWords from './components/savannah/unists/getWords';
import '@app/components/styles/style.scss';

const main = document.querySelector('.savannah_main');
const savannah = new Savannah(main, getWords);
localStorage.setItem('isFirst', '1');

savannah.mount();
