import { Component, AfterViewInit, Type } from '@angular/core';
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
  public stockfish: Stockfish = new Stockfish(20, 1, 1);

  constructor(
    private popoverController: PopoverController,
    private requestService: RequestService,
    public modalController: ModalController,
    private gameService: GamesService
  ) {
    this.stockfish.emmiter = this.stockfishEmmiter.bind(this);
   }

  ngAfterViewInit() {
    this.boardId = uuid.v4();
    this.userRating = this.gameService.getUserRating();
    this.setEndingData();
  }

  public setEndingData(){
    this.allEndings = [{
        fen: '1r1q1r2/p4p1k/bp1p2p1/3Bp3/4PP2/2PP2BP/PP4P1/R3K2R w KQ - 1 21',
        theme: ''
      }, {
        fen: '6k1/2R2p1p/1p2p1p1/4P3/2Pp1P1P/3B1K2/r5P1/8 b - - 2 35',
        theme: ''
      }, {
        fen: '1r3rk1/1p1b1p1p/p2p2p1/7P/P1PpPP1q/2N5/1P2B1P1/R1B2RK1 w - - 0 19',
        theme: ''
      },
    ];
    this.currentEnding = this.allEndings.splice(Math.floor(Math.random() * this.allEndings.length), 1)[0];
    setTimeout(() => {
      this.initPosition();
    }, 1000);
    // if (this.theme === 'all') {
    //   this.requestService.getPuzzlesFromRating(this.userRating).subscribe(data => {
    //     this.allPuzzles = data;
    //     this.currentPuzzle = this.allPuzzles.splice(Math.floor(Math.random() * this.allPuzzles.length), 1)[0];
    //     this.initPosition();
    //   });
    // } else {
    //   this.requestService.getPuzzlesFromTheme(this.theme).subscribe(data => {
    //     this.allPuzzles = data.filter(e => e.rating < this.userRating + 500 && e.rating > this.userRating - 500);
    //     this.currentPuzzle = this.allPuzzles.splice(Math.floor(Math.random() * this.allPuzzles.length), 1)[0];
    //     this.initPosition();
    //   });
    // }
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
