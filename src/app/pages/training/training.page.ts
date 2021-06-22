import { Component, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TrainingModalComponent } from '@components/training-modal/training-modal.component';
import { Stockfish } from '@classes/stockfish';
import { GamesService } from '@services/games.service';
import {ChessInstance} from '@libs/chess.js/chessInterface';
import openingsJSON from '@resources/openings.json';
import { OpeningInterface } from '@app/interfaces/opening.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';

declare const Chessboard: any;
declare const ChessboardArrows: any;
declare const Chess: any;
declare const $: any;

@Component( {
  selector: 'app-training',
  templateUrl: 'training.page.html',
  styleUrls: ['training.page.scss'],
} )
export class TrainingPage implements AfterViewInit {
  public board: any;
  public game: ChessInstance;
  public moves: string;
  public algebraicMoves: string[] = [];
  public stockfish: Stockfish = new Stockfish(20, 3, 1, 10);
  public userColor = 'w';
  public turn = 'w';
  public openingsBook: OpeningInterface[] = openingsJSON;
  public opening: OpeningInterface;

  public boardId = 'trainingBoard';
  public fromMove = '';

  constructor(
    private gamesService: GamesService,
    public modalController: ModalController,
    public httpClient: HttpClient
  ) {
    this.game = new Chess();
    this.moves = '';
    this.stockfish.emmiter = this.stockfishEmmiter.bind(this);
  }

  async ngAfterViewInit() {
    const modal = await this.modalController.create({
      component: TrainingModalComponent,
    });
    await modal.present();
    await modal.onDidDismiss().then(data => {
      this.userColor = data.data.userColor;
      this.openingsBook = openingsJSON.filter(e => e.name.includes(data.data.opening));
      this.createNewGame();
    });
    // this.createNewGame();
  }

  private createNewGame() {
    this.game = new Chess();
    this.board = Chessboard( this.boardId, {
      draggable: true,
      position: 'start',
      orientation: this.userColor === 'w' ? 'white' : 'black',
      onDragStart: this.onDragStart.bind(this),
      onDrop: this.onDrop.bind(this),
      onSnapEnd: this.onSnapEnd.bind(this)} );

    const arrows = new ChessboardArrows(`${this.boardId}Arrows`);

    console.log(`%c arrows`, `background: #df03fc; color: #f8fc03`, arrows);

    if (this.userColor === 'b') {
      this.makeMove(this.openingsBook[Math.floor(Math.random() * this.openingsBook.length)].movesVerbose[0]);
    }
  }

  private stockfishEmmiter(event: string) {
    if (event === 'bestmove') {
      if (this.game.turn() !== this.userColor) {
        const openings = this.openingsBook.filter(e => e.movesVerbose.join(' ').trim().includes(this.moves.trim()));
        if (openings.length > 0) {
          this.opening = openings[Math.floor(Math.random() * openings.length)];
          this.makeMove(this.opening.movesVerbose[this.moves.split(' ').length - 1]);
        } else {
          this.makeMove(
            Math.random() < 0.9 ?
            this.stockfish.bestmove :
            this.stockfish.lines[Math.floor(Math.random() * this.stockfish.lines.length)].moves[0]
          );
        }
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
      setTimeout(() => {
        this.endGame();
      }, 1500);
    }
  }

  public resize() {
    this.clearHighlightLegalMoves();
  }

  public endGame() {
    this.gamesService.addGame({
      date: new Date().toLocaleString(),
      pgn: this.game.pgn(),
      title: `${this.game.turn() === 'w' ? '0-1' : '1-0'} Game against Computer level ${this.stockfish.level}; ${this.opening?.name}`,
      opening: this.opening.name,
      movesVerbose: this.moves,
      userColor: this.userColor,
      endingPosition: this.game.fen()
    });
    this.ngAfterViewInit();
  }

  public onResign() {
    this.endGame();
  }

  onDragStart(source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (this.game.game_over()) {
      return false;
    }
    // only pick up pieces for the side to move
    if (this.game.turn() !== this.userColor || !piece.includes(this.userColor)) {
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
