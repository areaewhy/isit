/**
 * param {string} word
 * param {boolean} correct
 */
export async function addWord(word, correct) {
  const t = localStorage.getItem("word-list");
  let words = JSON.parse(t);

  let match = words.filter((a) => a.W == word.toUpperCase());

  // update
  if (match.length) {
    match[0].C++;
    match[0].R += correct ? 1 : 0;
    match[0].L = Date.now();
  }
  // add
  else {
    var n = {
      W: word.toUpperCase(),
      C: 1,
      R: correct ? 1 : 0,
      F: Date.now(),
      L: Date.now(),
    };

    words.push(n);
  }

  // write
  await localStorage.setItem("word-list", JSON.stringify(words));
}

export async function getAll() {
  return JSON.parse(localStorage.getItem("word-list"));
}

export function reset() {
  init(true);
}

function init(reset) {
  getAll((x) => {
    if (x == null || reset) cookieStore.setItem("word-list", "[]");
  });
}

init();

/**
 *  "word", "count", "right", "first seen", "last seen"
 * [{ W: "hello", C: 40, R: 5, F: 191922923, L: 9191923}]
 *
 *
 */
