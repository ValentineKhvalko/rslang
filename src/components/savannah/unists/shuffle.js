const shuffle = (arr) => {
  const arrCopy = [...arr];
  let j;
  let temp;
  for (let i = 0; i < arrCopy.length; i += 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arrCopy[j];
    arrCopy[j] = arrCopy[i];
    arrCopy[i] = temp;
  }

  return arrCopy;
};

export default shuffle;
