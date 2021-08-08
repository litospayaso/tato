import { Component, AfterViewInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GamesService } from '@services/games.service';
import { Stockfish } from '@classes/stockfish';
import { GameInterface } from '@app/interfaces/game.interface';
import { Storage } from '@ionic/storage';
import { ChessgroundConstructor, Key, Color, ChessgroundInterface } from 'src/libs/chessground/types/chessground';
import { PromotionModalComponent } from '@components/promotion-modal/promotion-modal.component';
import * as uuid from 'uuid';
import { ChessInstance } from '@libs/chess.js/chessInterface';
declare const Chessground: ChessgroundConstructor;
declare const Chess: any;

@Component( {
  selector: 'app-analysis',
  templateUrl: 'analysis.page.html',
  styleUrls: ['analysis.page.scss'],
} )
export class AnalysisPage implements AfterViewInit {

  public board: ChessgroundInterface;
  public game: ChessInstance;
  public moves: string;
  public algebraicMoves: string[] = [];
  public stockfish: Stockfish = new Stockfish(20, 6, 3);
  public userColor = 'w';
  public turn = 'w';
  public boardMovesPointer: number = undefined;
  public savedGame: GameInterface;
  public gameId: string | number;
  public boardId: string;

  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService,
    private popoverController: PopoverController,
    private storage: Storage
  ) {
    this.boardId = uuid.v4();

    this.game = new Chess();
    this.moves = '';
    this.stockfish.emmiter = this.stockfishEmmiter.bind(this);
    document.onkeydown = this.handleKeyPress.bind(this);
    this.route.params.subscribe(params => {
      const id = params.id;
      if (id) {
        if (gamesService.getGameById(id)) {
          const game = gamesService.getGameById(id);
          this.moves = game.movesVerbose;
          this.boardMovesPointer = 0;
          this.userColor = game.userColor;
          if (this.board) {
            this.board.set({
              orientation: this.userColor === 'w' ? 'white' : 'black',
            });
          }
        }
      }
   });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createNewGame();
    }, 200);
  }

  private createNewGame() {
    this.game = new Chess();
    this.board = Chessground(document.getElementById(this.boardId), {
      orientation: this.userColor === 'w' ? 'white' : 'black',
      movable: {
        color: 'white',
        free: false,
        dests: this.toDests(),
      },
      draggable: {
        showGhost: true
      }
    });
    this.board.set({
      movable: { events: { after: this.makeAMove() } }
    });
  }

  private toDests(): Map<Key, Key[]> {
    const dests = new Map();
    this.game.SQUARES.forEach(s => {
      const ms = this.game.moves({ square: s, verbose: true });
      if (ms.length) { dests.set(s, ms.map(m => m.to)); }
    });
    return dests;
  }

  private makeAMove() {
    return async (orig, dest) => {
      let move = `${orig}${dest}`;
      const origPiece = this.game.get(orig);
      if (origPiece.type === 'p' && ((origPiece.color === 'w' && dest.includes('8')) || (origPiece.color === 'b' && dest.includes('1')))) {
        const popover = await this.popoverController.create({
          component: PromotionModalComponent,
          componentProps: {
            color: `modal-color-${origPiece.color}`
          },
          translucent: false
        });
        await popover.present();
        const promotion = await popover.onDidDismiss();
        await popover.present();
        move = move.concat(promotion.data);
      }
      // tslint:disable-next-line:max-line-length
      const moves = this.boardMovesPointer ? this.getCurrentListMoves().slice(0, this.boardMovesPointer).join(' ').concat(` ${move}`) : this.moves.concat(` ${move}`);
      this.boardMovesPointer = undefined;
      this.game.move(move, { sloppy: true });
      this.moves = this.game.history({verbose: true}).map(e => `${e.from}${e.to}${e.promotion ? e.promotion : ''}`).join(' ');
      this.turn = this.game.turn();
      this.stockfish.evalPosition(moves);
      this.algebraicMoves = this.game.history();

      this.board.set({
        fen: this.game.fen(),
        turnColor: this.toColor(),
        movable: {
          color: this.toColor(),
          dests: this.toDests()
        }
      });

    };
  }

  private toColor(): Color {
    return (this.game.turn() === 'w') ? 'white' : 'black';
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
  private stockfishEmmiter(event: string) {
    if (event === 'bestmove') {
      if (this.stockfish.bestmove) {
        const match = this.stockfish.bestmove.match(/^([a-h][1-8])([a-h][1-8])/);
        this.board.set({
          drawable: { shapes: [] }
        });
        this.board.set({
          drawable: { shapes: [{ orig: match[1], dest: match[2], brush: 'blue' }] }
        });
      }
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

  private setPosition() {
    const moves = this.getCurrentListMoves().slice(0, this.boardMovesPointer).join(' ');
    this.game.load_pgn(moves, { sloppy: true });
    this.turn = this.game.turn();
    this.stockfish.evalPosition(moves);
    this.algebraicMoves = this.game.history();
    this.board.set({
      fen: this.game.fen(),
      turnColor: this.toColor(),
      movable: {
        color: this.toColor(),
        dests: this.toDests()
      }
  });
  }

}
