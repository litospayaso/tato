import { Component, AfterViewInit } from '@angular/core';
import { Stockfish } from '@classes/stockfish';
import { GamesService } from '@services/games.service';
declare const Chessboard: any;
declare const Chess: any;
declare const $: any;

@Component( {
  selector: 'app-training',
  templateUrl: 'training.page.html',
  styleUrls: ['training.page.scss'],
} )
export class TrainingPage implements AfterViewInit {
  public board: any;
  public game: any;
  public moves: string;
  public algebraicMoves: string[] = [];
  public stockfish: Stockfish = new Stockfish();
  public userColor = 'w';
  public turn = 'w';

  public boardId = 'trainingBoard';
  public fromMove = '';

  constructor(
    private gamesService: GamesService
  ) {
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
      onDrop: this.onDrop.bind(this),
      onSnapEnd: this.onSnapEnd.bind(this)} );
  }

  private stockfishEmmiter(event: string) {
    if (event === 'bestmove') {
      if (this.game.turn() !== this.userColor) {
        this.makeMove(this.stockfish.bestmove);
      }
    }
  }


  private makeMove(move: string) {
    this.clearHighlightLegalMoves();
    this.moves = this.moves.concat(` ${move}`);
    this.game.move(move, {sloppy: true});
    this.board.position(this.game.fen());
    this.turn = this.game.turn();
    setTimeout(() => {
      this.stockfish.evalPosition(this.moves);
      this.algebraicMoves = this.game.history();
    }, 700);
    if (this.game.in_checkmate()) {
      this.gamesService.addGame({
        date: new Date().toLocaleString(),
        pgn: this.game.pgn(),
        title: `${this.game.turn() === 'w' ? '0-1' : '1-0'} Game against Computer level 5`
      });
    }
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
    // this.board.position(this.game.fen());
  }


}
