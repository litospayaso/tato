import { Component, OnInit } from '@angular/core';
declare const Chessboard: any;
declare const Chess: any;
declare const STOCKFISH: any;

@Component( {
  selector: 'app-training',
  templateUrl: 'training.page.html',
  styleUrls: ['training.page.scss'],
} )
export class TrainingPage implements OnInit {
  public board: any;
  public game: any;
  public moves: string;

  constructor() {
    this.game = new Chess();
    this.moves = 'c2c3';
  }

  ngOnInit() {
    // this.game = new Chess();
    this.board = Chessboard( 'trainingBoard', 'start' );
    this.board.move('c2-c3');
    this.manageStockfish();
    // window.setTimeout( () => { this.makeRandomMove(); }, 500 );
  }

  private manageStockfish() {
    const stockfish = STOCKFISH();
    stockfish.onmessage = (event) => {
      if (event && event.includes) {
        // console.log(`%c event`, `background: #df03fc; color: #f8fc03`, event);
        if (event.includes('Total evaluation:')) {
          // console.log(`%c event`, `background: #df03fc; color: #f8fc03`, event);
        }
        if (event.includes('bestmove ')) {
          console.log(`%c event`, `background: #df03fc; color: #f8fc03`, event);
          if (event.split('ponder')[0].includes('e8g8') || event.split('ponder')[0].includes('e8c8') && this.board.position().e8 === 'bK') {
            this.board.move(event.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/)[2] === 'g8' ? 'h8-f8' : 'a8-d8');
          }
          if (event.split('ponder')[0].includes('e1g1') || event.split('ponder')[0].includes('e1c1') && this.board.position().e8 === 'wK') {
            this.board.move(event.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/)[2] === 'g1' ? 'h1-f1' : 'a1-d1');
          }
          if (this.moves.split(' ').length === 2) {
            event = 'bestmove d1a4';
          }
          // console.log(`%c event`, `background: #df03fc; color: #f8fc03`, event);
          if (!event.includes('none')) {

            const match = event.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);

            this.board.move(`${match[1]}-${match[2]}`);

            this.moves = this.moves.concat(` ${match[1]}${match[2]}${match[3] ? match[3] : ''}`);

            if (match[3]) {
              const pos = this.board.position();
              pos[match[2]] = `${this.moves.length % 2 ? 'w' : 'b'}${match[3].toUpperCase()}`;
              this.board.position(pos);
            }
            setTimeout(() => {
              stockfish.postMessage(`position startpos moves ${this.moves}`);
              stockfish.postMessage('eval');
              stockfish.postMessage('go depth 2 wtime 300000 winc 2000 btime 300000 binc 2000');
              stockfish.postMessage('eval');
            }, 700);
          }
        }
      }
    };
    stockfish.postMessage('uci');
    stockfish.postMessage('setoption name Skill Level value 20');
    stockfish.postMessage('setoption name Contempt Factor value 0');
    stockfish.postMessage('setoption name Skill Level value 0');
    stockfish.postMessage('setoption name Skill Level Maximum Error value 10');
    stockfish.postMessage('setoption name Skill Level Probability value 1');
    stockfish.postMessage('setoption name King Safety value 0');
    stockfish.postMessage('setoption name Skill Level value 0');
    stockfish.postMessage('setoption name Skill Level Maximum Error value 10');
    stockfish.postMessage('setoption name Skill Level Probability value 1');
    stockfish.postMessage('ucinewgame');
    stockfish.postMessage('isready');

    stockfish.postMessage('position startpos moves e2e4');
    stockfish.postMessage('position startpos moves e2e4');
    stockfish.postMessage('eval');
    stockfish.postMessage('go depth 1 wtime 300000 winc 2000 btime 300000 binc 2000');
    stockfish.postMessage('eval');

  }

  private makeRandomMove() {
    // const possibleMoves = this.game.moves();

    // // exit if the game is over
    // if ( this.game.game_over() ) {
    //   return;
    // }

    // const randomIdx = Math.floor( Math.random() * possibleMoves.length );
    // this.game.move( possibleMoves[randomIdx] );
    // this.board.position( this.game.fen() );

    // window.setTimeout( () => { this.makeRandomMove(); }, 500 );
  }

}
