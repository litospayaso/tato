const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('puzzles.csv');
  const puzzleArray = [];
  const themes = ["crushing","hangingPiece","long","middlegame","advantage","endgame","short","master","advancedPawn","kingsideAttack","quietMove","trappedPiece","pin","backRankMate","mate","mateIn2","fork","masterVsMaster","skewer","superGM","opening","discoveredAttack","oneMove","veryLong","exposedKing","rookEndgame","defensiveMove","deflection","promotion","mateIn1","clearance","equality","sacrifice","knightEndgame","pawnEndgame","attraction","queensideAttack","queenRookEndgame","hookMate","intermezzo","bishopEndgame","xRayAttack","capturingDefender","mateIn3","queenEndgame","interference","doubleCheck","zugzwang","smotheredMate","mateIn4","enPassant","castling","arabianMate","attackingF2F7","mateIn5","doubleBishopMate","anastasiaMate","dovetailMate","bodenMate","underPromotion"];
  const rating = {};
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    const lineData = line.split(',');

    //themes
    // lineData[7].split(' ').forEach(t => {
    //   themes[t] = themes[t] ? themes[t] + 1 : 1;
    // });

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
      filt = filt.slice(0, 1200);
      filt = filt.map(e => {
        return {
          fen: e.fen,
          moves: e.moves,
          rating: e.rating,
          gameUrl: e.gameUrl
        }
      });
      await fs.writeFileSync(`./themes/${theme}.json`, JSON.stringify(filt, null, 2), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }
      });
    }
  });
}

processLineByLine();