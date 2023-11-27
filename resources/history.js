/**
 * param {string} word
 * param {boolean} correct
 */
export function addWord(word, correct) {
  cookieStore.get("word-list").then((t) => {
    let words = JSON.parse(t.value);
    let match = words.filter((a) => a.WORD == word.toUpperCase());

    // update
    if (match.length) {
      match[0].C++;
      match[0].R += correct ? 1 : 0;
      match[0].L = Date.now();
    }
    // add
    else {
      var n = {
        W: word,
        C: 1,
        R: correct ? 1 : 0,
        F: Date.now(),
        L: Date.now(),
      };

      words.push(n);
    }

    // write
    cookieStore.set("word-list", JSON.stringify(words));
  });
}

export function getAll(callback) {
  cookieStore.get("word-list").then((t) => callback(t));
}

function init() {
  getAll((x) => {
    if (x == null) cookieStore.set("word-list", JSON.stringify([]));
  });
}

init();

/**
 *  "word", "count", "right", "first seen", "last seen"
 * [{ W: "hello", C: 40, R: 5, F: 191922923, L: 9191923}]
 *
 *
 */
