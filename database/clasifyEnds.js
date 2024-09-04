const fs = require('fs');
const readline = require('readline');
const endingsArray = [];
const cliProgress = require('cli-progress');
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.rect);
let firstBestMove = true;
let stockfish;
let index = 0;
const logger = fs.createWriteStream('endingsClasified.csv', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})

const writeNewLineInEndCSV = (resultData) => {
  let newCsv = JSON.stringify(Object.values(resultData));
  newCsv = newCsv.substring(1, newCsv.length-1).replace(/"/g,"");
  newCsv = newCsv.concat('\n');
    logger.write(newCsv); // append string to your file
};

async function processLineByLine() {
  console.clear();
  const fileStream = fs.createReadStream('endings.csv');
  // const fileStream = fs.createReadStream('puzzles.csv');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const lineData = line.split(',');
    const [puzzleId, fen, themes, evaluation] = lineData;
    //puzzles

    const puzzle = {
      puzzleId,
      fen,
      themes,
      evaluation
    }
    endingsArray.push(puzzle);
  }
  parseEveryEnd();
}

const parseEveryEnd = () => {
  bar1.start(endingsArray.length, 0);
  endingsArray.forEach((ending,index) => {
    const pos = {};
    let piecesInBoard = 0;
    let themes = '';
    const eval = Math.abs(parseFloat(ending.evaluation));
    const fen = ending.fen.split(' ')[0];
    [...fen].forEach(elem => {
      if (elem !== '/' && elem !== 'k' && elem !== 'K' && isNaN(parseInt(elem))) {
        pos[elem] = pos[elem] ? pos[elem] + 1 : 1;
        piecesInBoard += 1;
      }
    });
    if(piecesInBoard < 17) {
      if (!pos.q && !pos.Q && !pos.r && !pos.R && !pos.b && !pos.B && !pos.n && !pos.N){
        themes = themes.concat(' pawnEnding');
      }
      if ((pos.q || pos.Q) && !pos.r && !pos.R && !pos.b && !pos.B && !pos.n && !pos.N){
        themes = themes.concat(' queenEnding');
      }
      if (!pos.q && !pos.Q && (pos.r || pos.R) && !pos.b && !pos.B && !pos.n && !pos.N){
        themes = themes.concat(' rookEnding');
      }
      if (!pos.q && !pos.Q && !pos.r && !pos.R && (pos.b || pos.B || pos.n || pos.N)){
        themes = themes.concat(' minorPiecesEnding');
        if ((pos.b && !pos.B && !pos.n && pos.N) || 
            (!pos.b && pos.B && pos.n && !pos.N) ) {
          themes = themes.concat(' bishopvsknight');
        }
        if ((pos.b && pos.B && !pos.n && !pos.N) || 
            (!pos.b && !pos.B && pos.n && pos.N) ) {
          themes = themes.concat(' bishopvsbishop');
        }
        if ((pos.b && !pos.B && !pos.n && !pos.N) || 
            (!pos.b && pos.B && !pos.n && !pos.N) ) {
          themes = themes.concat(' bishopvspawns');
        }
        if ((!pos.b && !pos.B && pos.n && !pos.N) || 
            (!pos.b && !pos.B && !pos.n && pos.N) ) {
          themes = themes.concat(' knightvspawns');
        }
      }
      if ((pos.q && !pos.Q && !pos.r && pos.R && !pos.b && !pos.B && !pos.n && !pos.N) || 
          (!pos.q && pos.Q && pos.r && !pos.R && !pos.b && !pos.B && !pos.n && !pos.N)) {
        themes = themes.concat(' queenvsrook');
      }
      if ((pos.q && !pos.Q && !pos.r && !pos.R && !pos.b && pos.B && !pos.n && pos.N) || 
          (!pos.q && pos.Q && !pos.r && !pos.R && pos.b && !pos.B && pos.n && !pos.N)) {
        themes = themes.concat(' queenvsminorPieces');
      }
      if ((!pos.q && !pos.Q && pos.r && !pos.R && !pos.b && pos.B && !pos.n && pos.N) || 
          (!pos.q && !pos.Q && !pos.r && pos.R && pos.b && !pos.B && pos.n && !pos.N)) {
        themes = themes.concat(' rookvsminorPieces');
      }


      if(themes === '') {
        themes = themes.concat(' middlegameEnding');
      }
      if(eval < 1){
        themes = themes.concat(' draw');
      } else {
        themes = themes.concat(' advantage');
      }
      if(eval > 1 && eval < 3){
        themes = themes.concat(' veryHard');
      }
      if(eval > 3 && eval < 4){
        themes = themes.concat(' Hard');
      }
      if(eval > 4 && eval < 5){
        themes = themes.concat(' Medium');
      }
      if(eval > 5 && eval < 7){
        themes = themes.concat(' Easy');
      }
      if(eval > 7){
        themes = themes.concat(' veryEasy');
      }

      themes = themes.trim();
      ending.themes = themes;
      bar1.update(index + 1);
      if(index === endingsArray.length - 1) {
        bar1.stop();
      }
      writeNewLineInEndCSV(ending);
    }
  });
};

processLineByLine();

