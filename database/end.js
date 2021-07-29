const fs = require('fs');
const readline = require('readline');
const Chess = require('chess.js');
const endingsArray = [];
const Stockfish = require('stockfish');
const cliProgress = require('cli-progress');
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.rect);
let firstBestMove = true;
let stockfish;
let index = 0;
const logger = fs.createWriteStream('endings.csv', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})

const writeNewLineInEndCSV = (indexElem) => {
  const resultData = {
      puzzleId: endingsArray[indexElem].puzzleId,
      fen: endingsArray[indexElem].fen,
      themes: endingsArray[indexElem].themes,
      evaluation: endingsArray[indexElem].evaluation
    };
  let newCsv = JSON.stringify(Object.values(resultData));
  newCsv = newCsv.substring(1, newCsv.length-1).replace(/"/g,"");
  newCsv = newCsv.concat('\n');
  if(!newCsv.includes('mate')){
    logger.write(newCsv); // append string to your file
    // fs.appendFile('endings.csv', newCsv, () => {});
  }
};

async function processLineByLine() {
  console.clear();
  const fileStream = fs.createReadStream('endImport.csv');
  // const fileStream = fs.createReadStream('puzzles.csv');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    if(!line.includes('mate') && !line.includes('Mate')) {
      const lineData = line.split(',');
      //puzzles
  
      const puzzle = {
        puzzleId: lineData[0],
        fen: lineData[1],
        moves: lineData[2],
        movesArray: lineData[2].split(' '),
        rating: Number(lineData[3]),
        ratingDeviation: Number(lineData[4]),
        popularity: Number(lineData[5]),
        nbPlays: Number(lineData[6]),
        themes: lineData[7],
        gameUrl: lineData[8]
      }
      endingsArray.push(puzzle);
    }
  }
  parseEveryEnd();
}

const evalEnding = () => {
  if(index === endingsArray.length) {
    bar1.stop();
  } else {
    const ending = endingsArray[index];
    const game = Chess.Chess(ending.fen);
    ending.movesArray.forEach(move => {
      game.move(move, {sloppy: true});
    });
    
    endingsArray[index].fen = game.fen();
    stockfish.postMessage(`position fen ${game.fen()}`);
    stockfish.postMessage('eval');
    stockfish.postMessage(`go depth 1`);
    stockfish.postMessage('eval');
  }
}

const parseEveryEnd = () => {
  if(index === 0) {
    stockfish = Stockfish();
    bar1.start(endingsArray.length, 0);
  }
  stockfish.postMessage(`setoption name Skill Level value 20`);
  stockfish.postMessage('setoption name Skill Level value 0');
  stockfish.postMessage('setoption name Skill Level Maximum Error value 10');
  stockfish.postMessage('setoption name Skill Level Probability value 1');
  stockfish.onmessage = (event) => {
    if(event.includes('Total evaluation')) {
      endingsArray[index].evaluation = Number(event.match(/(-?[0-9]+.[0-9]+)/g)[0]);
    }
    if(event.includes('info ') && event.includes('multipv')) {
      if(event.includes('mate')) {
        endingsArray[index].themes = endingsArray[index].themes.concat(' mate');
      }
    }
    if(event.includes('bestmove')) {
      const match = event.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
      if(match) {
        const move = `${match[1]}${match[2]}${match[3] ? match[3] : ''}`;
        const game = Chess.Chess(endingsArray[index].fen);
        game.move(move, {sloppy: true});
        endingsArray[index].fen = game.fen();
        if (firstBestMove) {
          firstBestMove = false;
          stockfish.postMessage(`position fen ${game.fen()}`);
          stockfish.postMessage('eval');
          stockfish.postMessage(`go depth 1`);
          stockfish.postMessage('eval');    
        } else {
          writeNewLineInEndCSV(index);
          firstBestMove = true;
          index += 1;
          bar1.update(index);
          evalEnding();
        }
      } else {
        firstBestMove = true;
        index += 1;
        bar1.update(index);
        evalEnding();
      }
    }
  }
  evalEnding();
};

processLineByLine();

