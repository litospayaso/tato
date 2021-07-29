const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('endingsClasified.csv');
  const puzzleArray = [];
  const themes = ['pawnEnding', 'queenEnding', 'rookEnding', 'minorPiecesEnding', 'bishopvsknigth', 'bishopvsbishop', 'bishopvspawns', 'knightvspawns', 'queenvsrook', 'queenvsminorPieces', 'rookvsminorPieces', 'middlegameEnding', 'draw', 'veryHard', 'Hard', 'Medium', 'Easy', 'veryEasy'];
  const rating = {};
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
    //themes
    // lineData[7].split(' ').forEach(t => {
    //   themes[t] = themes[t] ? themes[t] + 1 : 1;
    // });

    //puzzles

    puzzleArray.push(puzzle);
  }

  // for(let rat=400; rat < 3300; rat+= 100){
  //   let filt = puzzleArray.filter(e => e.rating > rat && e.rating < rat + 50);
  //   if(filt.length > 0) {
  //     filt = filt.sort((a, b) => b.popularity - a.popularity);
  //     filt = filt.slice(0, 1200);
  //     filt = filt.map(e => {
  //       return {
  //         fen: e.fen,
  //         moves: e.moves,
  //         rating: e.rating,
  //         gameUrl: e.gameUrl
  //       }
  //     });
  //     await fs.writeFileSync(`./rating/${rat}.json`, JSON.stringify(filt, null, 2), 'utf8', function (err) {
  //       if (err) {
  //           return console.log(err);
  //       }
  //     });
  //   }
  // }

  themes.forEach(async theme => {
    let filt = puzzleArray.filter(e => e.themes.includes(theme));
    if(filt.length > 0) {
      filt = filt.sort((a, b) => b.popularity - a.popularity);
      filt = filt.slice(0, 6000);
      filt = filt.map(e => {
        return {
          fen: e.fen,
          theme: e.themes,
        }
      });
      await fs.writeFileSync(`./endings/${theme}.json`, JSON.stringify(filt, null, 2), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
      });
    }
  });
}

processLineByLine();