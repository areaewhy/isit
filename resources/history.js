/**
 * param {string} word
 * param {boolean} correct
 */
export async function addWord(word, correct) {
  const t = await cookieStore.get("word-list");

  let words = JSON.parse(t.value);
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
  await cookieStore.set("word-list", JSON.stringify(words));
}

export async function getAll() {
  const cookie = await cookieStore.get("word-list");
  return JSON.parse(cookie.value);
}

export function reset() {
  init(true);
}

function init(reset) {
  getAll((x) => {
    if (x == null || reset) cookieStore.set("word-list", JSON.stringify([]));
  });
}

init();

/**
 *  "word", "count", "right", "first seen", "last seen"
 * [{ W: "hello", C: 40, R: 5, F: 191922923, L: 9191923}]
 *
 *
 */
