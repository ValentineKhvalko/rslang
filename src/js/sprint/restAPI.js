class RestAPI {
  static async getAllWords(group) {
    const url = `https://afternoon-falls-25894.herokuapp.com/words?group=${group}&wordsPerExampleSentenceLTE=30&wordsPerPage=600`;
    const res = await fetch(url);
    const obj = await res.json();

    return obj;
  }
}

export default RestAPI;
