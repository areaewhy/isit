//import acceptable from "./resources/words.json" assert { type: "json" };
import { getAll, addWord } from "./resources/history.js";
const { default: acceptable } = await import("./resources/words.json", { assert: { type: "json" } })
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

  const definition = is_a_word ? match[0].DEF : null;

  const message = `"${word}" is ${is_a_word ? "" : "NOT"} a word!`;
  const outcome = `You're ${is_a_word == guess ? "RIGHT!" : "WRONG!"}`;

  guess_result.innerHTML = "";
  // for color styling:
  guess_result.setAttribute("right", is_a_word == guess);

  const result = buildResult(
    is_a_word ? word : "",
    outcome,
    definition ?? message
  );

  guess_result.appendChild(result);

  if (document.querySelector("#auto-load").checked) {
    guess_result.appendChild(buildLoader());

    retryTimer = setTimeout(generate, retryTimeMs);
  }

  addWord(word, is_a_word == guess).then(() => refreshHistory());
}

function buildResult(word, outcome, definition) {
  const result = document
    .querySelector("#guess-result-word")
    .content.cloneNode(true);

  result.querySelector(".outcome").innerText = outcome;
  result.querySelector(".definition").innerText = definition;
  result.querySelector(".word").innerText = word;

  return result;
}

function buildLoader() {
  var d = document.querySelector("#loader").content.cloneNode(true);
  d.querySelector(".load-bar").style.animationDuration = retryTimeMs + "ms";
  return d;
}

function search() {
  const word = document.querySelector("#search").value;
  const match = acceptable.filter((a) =>
    a.WORD.toUpperCase().startsWith(word.toUpperCase())
  );
  const targ = document.querySelector(".search-result");
  targ.innerHTML = "";

  if (word > "") {
    for (var m of match) {
      var result = buildResult(m.WORD, "", m.DEF);
      targ.appendChild(result);
    }
  }
}

function refreshHistory() {
  // this is gross, don't bother yet.
  return;

  const targ = document.querySelector("#history");
  targ.innerHTML = "";

  getAll().then((a) => {
    a.sort((a, b) => (a.L < b.L ? 1 : -1))
      .slice(0, 5)
      .map((w) => {
        const template = document
          .querySelector("#history-template")
          .content.cloneNode(true);

        template.querySelector(".word").innerText = w.W;
        template.querySelector(".seen").innerText = w.C;
        template.querySelector(".accuracy").innerText = w.R / (w.C * 1.0);

        targ.appendChild(template);
      });
  });
}

function Setup() {
  document.querySelector(".generate").addEventListener("click", generate);
  document.querySelector("#search").addEventListener("keyup", search);
}

Setup();
generate();
