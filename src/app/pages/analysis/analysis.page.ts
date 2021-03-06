import { Component, AfterViewInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import {Stockfish} from '@classes/stockfish';
declare const Chessboard: any;
declare const Chess: any;
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
  public stockfish: Stockfish = new Stockfish();
  public userColor = 'w';
  public turn = 'w';

  public boardId = 'analysisBoard';
  public fromMove = '';

  constructor() {
    this.game = new Chess();
    this.moves = '';
    this.stockfish.emmiter = this.stockfishEmmiter.bind(this);
  }

  ngAfterViewInit() {
    this.createNewGame();
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
    this.moves = this.moves.concat(` ${move}`);
    this.game.move(move, {sloppy: true});
    this.board.position(this.game.fen());
    this.turn = this.game.turn();
    this.stockfish.evalPosition(this.moves);
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

  genNumber(): number {
    return Math.random() * 100;
  }
}
