fetch('https://www.wineverygame.com/scrabble-us/scrabble-two-letter-words.html')
.then(c => c.text())
.then(x =>{
const doc = new DOMParser().parseFromString(x, 'text/html');
const words = Array.from(doc.querySelectorAll('#content ul li')).map(l => l.innerText.split(' - '));
    console.log(JSON.stringify(words.map(w => ({ WORD: w[0], DEF: w[1]}))))
})