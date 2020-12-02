import { Component, AfterViewInit } from '@angular/core';
declare const Chessboard: any;
declare const Chess: any;
declare const STOCKFISH: any;
declare const $: any;

@Component( {
  selector: 'app-analysis',
  templateUrl: 'analysis.page.html',
  styleUrls: ['analysis.page.scss'],
} )
export class AnalysisPage implements AfterViewInit {
  public board: any;
  public game: any;
  public moves: string;
  public algebraicMoves: string[] = [];
  public stockfish: any;
  public userColor = 'w';
  public turn = 'w';

  public boardId = 'trainingBoard';
  public fromMove = '';

  constructor() {
    this.game = new Chess();
    this.moves = '';
  }

  ngAfterViewInit() {
    this.createNewGame();
    this.manageStockfish();
  }

  private createNewGame() {
    this.game = new Chess();
    this.board = Chessboard( this.boardId, {
      draggable: true,
      position: 'start',
      onDragStart: this.onDragStart.bind(this),
      onDrop: this.onDrop.bind(this),
      onSnapEnd: this.onSnapEnd.bind(this)} );
  }

  private manageStockfish() {
    this.stockfish = STOCKFISH();
    this.stockfish.onmessage = (event) => {
      if (event && event.includes) {
        if (event.includes('Total evaluation:')) {
        }
        if (event.includes('bestmove ') && !event.includes('none')) {
          if (this.game.turn() !== this.userColor) {
            const match = event.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
            this.makeMove(`${match[1]}${match[2]}${match[3] ? match[3] : ''}`);
          }
        }
      }
    };
    this.stockfish.postMessage('uci');
    // this.stockfish.postMessage('setoption name Skill Level value 20');
    this.stockfish.postMessage('setoption name Skill Level value 5');
    this.stockfish.postMessage('setoption name Contempt Factor value 0');
    this.stockfish.postMessage('setoption name Skill Level value 0');
    this.stockfish.postMessage('setoption name Skill Level Maximum Error value 10');
    this.stockfish.postMessage('setoption name Skill Level Probability value 1');
    this.stockfish.postMessage('setoption name King Safety value 0');
    this.stockfish.postMessage('setoption name Skill Level value 0');
    this.stockfish.postMessage('setoption name Skill Level Maximum Error value 10');
    this.stockfish.postMessage('setoption name Skill Level Probability value 1');
    this.stockfish.postMessage('ucinewgame');
    this.stockfish.postMessage('isready');

    // this.stockfish.postMessage('position startpos moves e2e4');
    // this.stockfish.postMessage('position startpos moves e2e4');
    // this.stockfish.postMessage('eval');
    // this.stockfish.postMessage('go depth 1 wtime 300000 winc 2000 btime 300000 binc 2000');
    // this.stockfish.postMessage('eval');

  }

  private makeMove(move: string) {
    this.clearHighlightLegalMoves();
    this.moves = this.moves.concat(` ${move}`);
    this.game.move(move, {sloppy: true});
    this.board.position(this.game.fen());
    this.turn = this.game.turn();
    setTimeout(() => {
      this.stockfish.postMessage(`position startpos moves ${this.moves}`);
      this.stockfish.postMessage('eval');
      this.stockfish.postMessage('go depth 2 wtime 300000 winc 2000 btime 300000 binc 2000');
      this.stockfish.postMessage('eval');
      this.algebraicMoves = this.game.history();
    }, 700);
  }

  public resize() {
    this.clearHighlightLegalMoves();
  }


  onDragStart(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (this.game.game_over()) {
      return false;
    }
    // only pick up pieces for the side to move
    if ((this.game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (this.game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false;
    }

    const legalMoves = this.game.moves({
      square: source,
      verbose: true
    });


    this.highlightLegalMoves(legalMoves);
  }

  clearHighlightLegalMoves() {
    this.fromMove = '';
    $(`#${this.boardId} .end-move`).off();
    $(`#${this.boardId} .end-move`).removeClass('end-move');
    $(`#${this.boardId} .start-move`).removeClass('start-move');
  }

  highlightLegalMoves(moves) {
    this.clearHighlightLegalMoves();
    if (moves[0]) {
      this.fromMove = moves[0].from;
      $(`#${this.boardId} .square-${this.fromMove}`).addClass('start-move');
    }
    moves.forEach(move => {
      $(`#${this.boardId} .square-${move.to}`).addClass('end-move');
    });

    $(`#${this.boardId} .end-move`).on('click', this.moveOnClick.bind(this));

  }

  moveOnClick(event) {
    const toMove = event.target.getAttribute('data-square') ?
      event.target.getAttribute('data-square') :
      event.target.closest('.end-move').getAttribute('data-square');
    this.makeMove(`${this.fromMove}${toMove}`);
  }

  onDrop(source, target, piece, newPos) {
    // see if the move is legal

    const game = new Chess();
    game.load(this.game.fen());
    const move = game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) {
      return 'snapback';
    } else {
      this.makeMove(`${source}${target}`);
    }
  }

  // update the board position after the piece snap
  // for castling, en passant, pawn promotion
  onSnapEnd() {
    this.board.position(this.game.fen());
  }


}
