import { Component, AfterViewInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { TrainingModalComponent } from '@components/training-modal/training-modal.component';
import { ResultModalComponent } from '@components/result-modal/result-modal.component';
import { ActivatedRoute } from '@angular/router';
import { GamesService } from '@services/games.service';
import { Stockfish } from '@classes/stockfish';
import { GameInterface } from '@app/interfaces/game.interface';
import { Storage } from '@ionic/storage';
import { ChessgroundConstructor, Key, Color, ChessgroundInterface } from 'src/libs/chessground/types/chessground';
import { PromotionModalComponent } from '@components/promotion-modal/promotion-modal.component';
import * as uuid from 'uuid';
import { ChessInstance } from '@libs/chess.js/chessInterface';
import openingsJSON from '@resources/openings.json';
import { OpeningInterface } from '@app/interfaces/opening.interface';
declare const Chessground: ChessgroundConstructor;
declare const Chess: any;

@Component({
  selector: 'app-training',
  templateUrl: 'training.page.html',
  styleUrls: ['training.page.scss'],
})
export class TrainingPage implements AfterViewInit {

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
  public openingsBook: OpeningInterface[] = openingsJSON;
  public opening: OpeningInterface;
  public openingName = 'Scandinavian Defense';

  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService,
    public modalController: ModalController,
    private popoverController: PopoverController,
    private storage: Storage
  ) {
    this.boardId = uuid.v4();
    this.game = new Chess();
    this.stockfish.emmiter = this.stockfishEmmiter.bind(this);
  }

  async ngAfterViewInit() {
    const defaultOpeningValues = this.gamesService.getDefaultOpeningValues();
    if (defaultOpeningValues) {
      this.openingName = defaultOpeningValues.opening;
      this.userColor = defaultOpeningValues.userColor;
    }
    const modal = await this.modalController.create({
      component: TrainingModalComponent,
      componentProps: {
        defaultOpeningValues: {
          opening: this.openingName,
          userColor: this.userColor,
        }
      },
    });
    await modal.present();
    await modal.onDidDismiss().then(data => {
      if (data.data) {
        this.gamesService.setDefaultOpeningValues(data.data);
      }
      this.userColor = data.data ? data.data.userColor : 'w';
      this.openingsBook = openingsJSON.filter(e => e.name.includes(data.data ? data.data.opening : 'Scandinavian Defense'));
      this.createNewGame();
    });
  }

  private createNewGame() {
    this.moves = '';
    this.algebraicMoves = [];
    this.game = new Chess();
    this.board = Chessground(document.getElementById(this.boardId), {
      orientation: this.userColor === 'w' ? 'white' : 'black',
      movable: {
        color: this.userColor === 'w' ? 'white' : 'black',
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
    if (this.userColor === 'b') {
      this.stockfishEmmiter('bestmove');
    }

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
      this.moves = this.game.history({ verbose: true }).map(e => `${e.from}${e.to}${e.promotion ? e.promotion : ''}`).join(' ');
      this.turn = this.game.turn();
      this.stockfish.evalPosition(moves);
      this.algebraicMoves = this.game.history();

      this.board.set({
        fen: this.game.fen(),
        turnColor: this.toColor(),
        check: this.game.in_check() ? (this.userColor === 'w' ? 'black' : 'white') : false,
        movable: {
          color: this.toColor(),
          dests: this.toDests()
        }
      });
      if (this.game.in_checkmate() || this.game.in_draw() || this.game.in_stalemate() || this.game.in_threefold_repetition()) {
        setTimeout(() => {
          this.endGame();
        }, 1500);
      }
    };
  }

  public onResign() {
    this.endGame(this.userColor === 'w' ? '0-1' : '1-0');
  }

  public async endGame(result?: string) {
    const gameResult = result ? result : (this.game.in_checkmate() ? (this.game.turn() === 'w' ? '0-1' : '1-0') : '1/2 - 1/2');
    this.gamesService.addGame({
      id: uuid.v4(),
      date: new Date().toLocaleString(),
      pgn: this.game.pgn(),
      opening: this.opening?.name,
      movesVerbose: this.moves,
      userColor: this.userColor,
      endingPosition: this.game.fen(),
      gameResult
    });
    const modal = await this.modalController.create({
      component: ResultModalComponent,
      componentProps: {
        result: gameResult,
        userColor: this.userColor
      },
    });
    await modal.present();
    await modal.onDidDismiss().then(({ data }) => {
      if (data) {
        if (data.data === 'newGame') {
          this.ngAfterViewInit();
        }
        if (data.data === 'retry') {
          this.createNewGame();
        }
      }
    });
  }

  private makeMove(move: string) {
    this.game.move(move, { sloppy: true });
    this.moves = this.game.history({ verbose: true }).map(e => `${e.from}${e.to}${e.promotion ? e.promotion : ''}`).join(' ');
    this.turn = this.game.turn();
    this.algebraicMoves = this.game.history();

    this.board.set({
      fen: this.game.fen(),
      check: this.game.in_check() ? (this.userColor === 'w' ? 'white' : 'black') : false,
      turnColor: this.toColor(),
      movable: {
        color: this.toColor(),
        dests: this.toDests()
      }
    });
    if (this.game.in_checkmate() || this.game.in_draw() || this.game.in_stalemate() || this.game.in_threefold_repetition()) {
      setTimeout(() => {
        this.endGame();
      }, 1500);
    }
  }

  private toColor(): Color {
    return (this.game.turn() === 'w') ? 'white' : 'black';
  }

  private stockfishEmmiter(event: string) {
    if (event === 'bestmove') {
      if (this.stockfish.bestmove || this.moves === '') {
        if (this.game.turn() !== this.userColor) {
          // this.makeMove(this.stockfish.bestmove);
          const openings = this.openingsBook.filter(e => e.movesVerbose.join(' ').trim().startsWith(this.moves.trim()));
          if (openings.length > 0) {
            this.opening = openings[Math.floor(Math.random() * openings.length)];
            const index = this.moves === '' ? 0 : this.moves.split(' ').length;
            if (this.opening.movesVerbose[index]) {
              this.makeMove(this.opening.movesVerbose[index]);
            } else {
              this.makeStockfishMovement();
            }
          } else {
            this.makeStockfishMovement();
          }
        }
      }
    }
  }

  private makeStockfishMovement() {
    this.makeMove(
      Math.random() < 0.9 ?
        this.stockfish.bestmove :
        this.stockfish.lines[Math.floor(Math.random() * this.stockfish.lines.length)].moves[0]
    );
  }

  getCurrentListMoves(): string[] {
    return this.moves.trim().split(' ').filter(e => e !== '');
  }

}
