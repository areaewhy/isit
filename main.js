import acceptable from "./resources/words.json" assert { type: "json" };

let retryTimeMs = 3000;
let retryTimer = null;

const alphabet = Array.from("abcdefghijklmnopqrstuvwxyz");

const letters = (() => {
  // make vowels more common!
  let vowels = Array.from("aeiouy".repeat(10));
  return alphabet.concat(vowels);
})();

const target = document.querySelector("#result");
const guess_result = document.querySelector("#guess");

function random() {
  const ix = Math.floor(Math.random() * letters.length);
  return letters[ix];
}

function generate() {
  target.innerHTML = `${random().toUpperCase()}${random()}`;
  //target.innerHTML = "Ax";

  const buttons = document.querySelector("#chooser").content.cloneNode(true);
  guess_result.innerHTML = "";

  var clicker = buttons.querySelectorAll("button");
  clicker[0].addEventListener("click", () => it_is(true));
  clicker[1].addEventListener("click", () => it_is(false));

  guess_result.appendChild(buttons);

  clearInterval(retryTimer);
}

function it_is(guess) {
  const word = target.innerHTML.toUpperCase();
  const match = acceptable.filter((a) => a.WORD == word);
  const is_a_word = match.length > 0;
  console.log(match);

  const definition = is_a_word ? match[0].DEF : null;

  const message = `"${word}" is ${is_a_word ? "" : "NOT"} a word!`;
  const outcome = `You're ${is_a_word == guess ? "RIGHT!" : "WRONG!"}`;

  guess_result.innerHTML = "";
  if (is_a_word == guess) {
    guess_result.setAttribute("correct", is_a_word);
  } else {
    guess_result.setAttribute("wrong", is_a_word);
  }

  const result = document
    .querySelector("#guess-result-word")
    .content.cloneNode(true);
  result.querySelector(".outcome").innerText = outcome;

  if (is_a_word) {
    result.querySelector(".word").innerText = word;
  }

  result.querySelector(".definition").innerText = definition ?? message;

  guess_result.appendChild(result);

  //guess_result.appendChild(buildLoader());

  //retryTimer = setTimeout(generate, retryTimeMs);
}

function buildLoader() {
  var d = document.querySelector("#loader").content.cloneNode(true);
  d.querySelector(".load-bar").style.animationDuration = retryTimeMs + "ms";
  return d;
}

function Setup() {
  document.querySelector(".generate").addEventListener("click", generate);
}

Setup();
generate();
