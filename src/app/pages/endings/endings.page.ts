import { Component, AfterViewInit, Type } from '@angular/core';
import { EndingsModalComponent } from '@components/endings-modal/endings-modal.component';
import { PopoverController } from '@ionic/angular';
import { EndingInterface } from '@app/interfaces/ending.interface';
import { ChessgroundConstructor, Key, Color, ChessgroundInterface } from 'src/libs/chessground/types/chessground';
import { GamesService } from '@services/games.service';
import { RequestService } from '@services/request.service';
import { ChessInstance } from '@libs/chess.js/chessInterface';
import { PromotionModalComponent } from '@components/promotion-modal/promotion-modal.component';
import { ModalController } from '@ionic/angular';
import { PuzzlesModalComponent } from '@components/puzzles-modal/puzzles-modal.component';
import { Stockfish } from '@classes/stockfish';
import * as uuid from 'uuid';
declare const Chessground: ChessgroundConstructor;
declare const Chess: any;


@Component({
  selector: 'app-endings',
  templateUrl: 'endings.page.html',
  styleUrls: ['endings.page.scss'],
})
export class EndingsPage implements AfterViewInit {

  public currentEnding: EndingInterface;
  public currentPuzzlePointer: number;
  public userColor: Color;
  public moves: string;
  public turn = 'w';
  public board: ChessgroundInterface;
  public game: ChessInstance;
  public boardId: string;
  public userRating: number;
  public allEndings: EndingInterface[];
  public puzzlesToMakeANewRequest = 10;
  public failed = false;
  public theme = 'all';
  public dificulty = 'Medium';
  public stockfish: Stockfish = new Stockfish(20, 12, 3);

  constructor(
    private popoverController: PopoverController,
    private requestService: RequestService,
    public modalController: ModalController,
    private gameService: GamesService
  ) {
    this.stockfish.emmiter = this.stockfishEmmiter.bind(this);
   }

  async ngAfterViewInit() {
    this.boardId = uuid.v4();
    this.userRating = this.gameService.getUserRating();
    const defaultEndingsValues = this.gameService.getDefaultEndingsValues();
    if (defaultEndingsValues) {
      this.dificulty = defaultEndingsValues.dificulty;
      this.theme = defaultEndingsValues.theme;
    }
    const modal = await this.modalController.create({
      component: EndingsModalComponent,
      componentProps: {
        defaultEndingsValues: {
          theme: this.theme,
          dificulty: this.dificulty,
        }
      },
    });
    await modal.present();
    await modal.onDidDismiss().then(data => {
      console.log(`%c data`, `background: #df03fc; color: #f8fc03`, data);
      if (data.data) {
        this.gameService.setDefaultEndingValues(data.data);
      }
      this.theme = data.data.theme;
      this.dificulty = data.data.dificulty;
      this.setEndingData();
    });
  }

  public setEndingData(){
    if (this.theme === 'all') {
      this.requestService.getEndingsFromTheme(this.dificulty).subscribe(data => {
        this.allEndings = data;
        this.currentEnding = this.allEndings.splice(Math.floor(Math.random() * this.allEndings.length), 1)[0];
        this.initPosition();
      });
    } else {
      this.requestService.getEndingsFromTheme(this.theme).subscribe(data => {
        this.allEndings = data.filter(e => e.theme.includes(this.dificulty));
        this.currentEnding = this.allEndings.splice(Math.floor(Math.random() * this.allEndings.length), 1)[0];
        this.initPosition();
      });
    }
  }

  public initPosition() {
    this.failed = false;
    this.game = new Chess(this.currentEnding.fen);
    this.moves = '';
    this.userColor = this.currentEnding.fen.split(' ')[1] === 'w' ? 'black' : 'white';
    this.board = Chessground(document.getElementById(this.boardId), {
      orientation: this.userColor,
      fen: this.currentEnding.fen,
      turnColor: this.userColor,
      movable: {
        color: this.userColor,
        free: false,
        dests: this.toDests(),
      },
      draggable: {
        showGhost: true
      },
    });
    this.board.set({
      movable: { events: { after: this.makeAMove() } }
    });
    this.stockfish.evalFen(this.game.fen());
    setTimeout(() => {
      // this.makeComputerMove(this.currentEnding);
    }, 1000);
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
      const moves = this.moves.concat(` ${move}`);
      this.moves = moves;
      // this.moves = this.game.history({verbose: true}).map(e => `${e.from}${e.to}${e.promotion ? e.promotion : ''}`).join(' ');
      this.game.move(move, { sloppy: true });
      this.turn = this.game.turn();
      if (this.game.in_checkmate() || this.game.in_draw() || this.game.in_stalemate() || this.game.in_threefold_repetition()) {
        setTimeout(() => {
          this.endGame();
        }, 1500);
      }
      this.stockfish.evalFen(this.game.fen());
    };
  }

  private makeMove(move: string) {
    this.game.move(move, { sloppy: true });
    const moves = this.moves.concat(` ${move}`);
    this.moves = moves;
    // this.moves = this.game.history({verbose: true}).map(e => `${e.from}${e.to}${e.promotion ? e.promotion : ''}`).join(' ');
    this.turn = this.game.turn();

    this.board.set({
      fen: this.game.fen(),
      check: this.game.in_check() ? this.userColor : false,
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

  private toDests(): Map<Key, Key[]> {
    const dests = new Map();
    this.game.SQUARES.forEach(s => {
      const ms = this.game.moves({ square: s, verbose: true });
      if (ms.length) { dests.set(s, ms.map(m => m.to)); }
    });
    return dests;
  }


  public async openSettings() {
    const modal = await this.modalController.create({
      component: PuzzlesModalComponent,
      componentProps: {
        theme: this.theme
      },
    });
    await modal.present();
    await modal.onDidDismiss().then(data => {
      if (data.data) {
        this.theme = data.data.theme;
        this.setEndingData();
      }
    });
  }

  private stockfishEmmiter(event: string) {
    if (event === 'bestmove') {
      if (this.stockfish.bestmove || this.moves === '') {
        const turn = this.game.turn() === 'w' ? 'white' : 'black';
        if (turn !== this.userColor) {
          this.makeMove(this.stockfish.bestmove);
        }
      }
    }
  }

  public endGame() {
    const gameResult = this.game.in_checkmate() ? (this.game.turn() === 'w' ? '0-1' : '1-0') : '1/2 - 1/2';
    console.log(`%c gameResult`, `background: #df03fc; color: #f8fc03`, gameResult);
    // this.gamesService.addGame({
    //   date: new Date().toLocaleString(),
    //   pgn: this.game.pgn(),
    //   title: `${gameResult} Game against Computer level ${this.stockfish.level}; ${this.opening?.name}`,
    //   opening: this.opening?.name,
    //   movesVerbose: this.moves,
    //   userColor: this.userColor,
    //   endingPosition: this.game.fen()
    // });
    this.ngAfterViewInit();
  }
}
