import words from "../resources/words.json" assert { type: "json" };

const event = new CustomEvent("wordLoad", {
  words: words,
});

window.dispatchEvent(event);
