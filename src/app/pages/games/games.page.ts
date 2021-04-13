import { Component, AfterViewInit } from '@angular/core';
import {Stockfish} from '@classes/stockfish';
declare const Chessboard: any;
declare const Chess: any;
declare const $: any;

@Component( {
  selector: 'app-games',
  templateUrl: 'games.page.html',
  styleUrls: ['games.page.scss'],
} )
export class GamesPage implements AfterViewInit {
  public board: any;
  public game: any;
  public moves: string;
  public algebraicMoves: string[] = [];
  public stockfish: Stockfish = new Stockfish(20, 6, 3);
  public userColor = 'w';
  public turn = 'w';
  public boardMovesPointer: number = undefined;

  public boardId = 'analysisBoard';
  public fromMove = '';

  constructor() {
    this.game = new Chess();
    this.moves = '';
    this.stockfish.emmiter = this.stockfishEmmiter.bind(this);
    document.onkeydown = this.handleKeyPress.bind(this);
  }

  ngAfterViewInit() {
    this.createNewGame();
  }

  private handleKeyPress(event: KeyboardEvent) {
    switch (event.code) {
      case 'ArrowLeft':
        this.moveBackward();
        break;
      case 'ArrowRight':
        this.moveForward();
        break;
      default:
        break;
    }
  }

  private createNewGame() {
    this.game = new Chess();
    this.board = Chessboard( this.boardId, {
      draggable: true,
      position: 'start',
      onDragStart: this.onDragStart.bind(this),
      onDrop: this.onDrop.bind(this)
    });
  }

  private stockfishEmmiter(event: string) {
    if (event === 'bestmove') {
      // if (this.game.turn() !== this.userColor) {
      //   this.makeMove(this.stockfish.bestmove);
      // }
    }
  }


  private makeMove(move: string) {
    this.clearHighlightLegalMoves();
    // tslint:disable-next-line:max-line-length
    const moves = this.boardMovesPointer ? this.getCurrentListMoves().slice(0, this.boardMovesPointer).join(' ').concat(` ${move}`) : this.moves.concat(` ${move}`);
    this.boardMovesPointer = undefined;
    this.moves = moves;
    this.game.move(move, {sloppy: true});
    this.board.position(this.game.fen());
    this.turn = this.game.turn();
    this.stockfish.evalPosition(moves);
    this.algebraicMoves = this.game.history();
  }

  private setPosition() {
    const moves = this.getCurrentListMoves().slice(0, this.boardMovesPointer).join(' ');
    this.clearHighlightLegalMoves();
    this.game.load_pgn(moves, {sloppy: true});
    this.board.position(this.game.fen());
    this.turn = this.game.turn();
    this.stockfish.evalPosition(moves);
    this.algebraicMoves = this.game.history();
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

  getCurrentListMoves(): string[] {
    return this.moves.trim().split(' ').filter(e => e !== '');
  }

  moveForward() {
    if (this.boardMovesPointer >= 0 && this.boardMovesPointer < this.getCurrentListMoves().length) {
      this.boardMovesPointer = this.boardMovesPointer + 1;
      this.setPosition();
    }
  }

  moveBackward() {
    if (this.getCurrentListMoves().length > 0 && this.boardMovesPointer !== 0) {
      this.boardMovesPointer = this.boardMovesPointer ? this.boardMovesPointer - 1 : this.getCurrentListMoves().length - 1;
      this.setPosition();
    }
  }
}
