let acceptable = {};
(()=> fetch('./words.json').then(t => t.json()).then(j => {
  acceptable = j;
  reset();
}))();

const maxGuesses = 5;
let guessCount = maxGuesses;
let ok_to_rest = false;
let lastGuess = "";

function guess() {
  return document.querySelector("#word-guess").value;
}
function definition() {
  return document.querySelector(".definition").innerText;
}

function reset() {
  guessCount = maxGuesses;
  ok_to_rest = false;
  lastGuess = "";

  // random def:
  const r = Math.floor(Math.random() * acceptable.length);
  const selection = acceptable[r];

  const def = document.querySelector(".definition");
  def.innerText = selection.DEF;

  document.querySelector("#word-guess-result").innerHTML = "";
  document.querySelector("#word-guess").value = "";
  
  document.getElementById('word-guess').focus();
}

/**
 *
 * @param {string} word
 * @param {string} definition
 */
function validate(word, definition) {
  if (word === undefined) return false;

  const matches = acceptable.filter(
    (a) => a.DEF === definition && a.WORD.toUpperCase() == word.toUpperCase()
  );

  return matches.length > 0;
}

function submitGuess(event) {
  console.log(event);
  if (ok_to_rest && event.key == "Enter") {
    reset();
    return;
  }

  if (event.key == "Backspace" || event.key == "Delete") {
    document.querySelector("#word-guess").value = "";
  }

  const result = document.querySelector("#word-guess-result");

  const match = acceptable.filter((a) => a.DEF == definition());

  if (guessCount <= 0) {
    result.innerHTML = `Fail! <div class="failed">${match[0].WORD}</div>`;
    return;
  }

  const g = guess();
  if (g == lastGuess) return;
  lastGuess = g;

  if (g.length < 2) {
    return;
  }

  guessCount--;
  result.innerHTML = `${guessCount} guesses left.`;

  const def = definition();

  const correct = validate(g, def);

  const message = correct ? "YEP!" : `Nope.. ${guessCount} guesses left.`;

  result.innerHTML = `<div right="${correct}">${message}</div>`;

  ok_to_rest = correct || guessCount < 1;
}

function Setup() {
  document.querySelector("#word-guess").addEventListener("keyup", submitGuess);
  document.querySelector("#reset").addEventListener("click", reset);
}

Setup();
//reset();
