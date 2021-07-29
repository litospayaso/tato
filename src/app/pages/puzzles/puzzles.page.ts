import { Component, AfterViewInit, Type } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PuzzleInterface } from '@app/interfaces/game.interface';
import { ChessgroundConstructor, Key, Color, ChessgroundInterface } from 'src/libs/chessground/types/chessground';
import { GamesService } from '@services/games.service';
import { RequestService } from '@services/request.service';
import { ChessInstance } from '@libs/chess.js/chessInterface';
import { PromotionModalComponent } from '@components/promotion-modal/promotion-modal.component';
import { ModalController } from '@ionic/angular';
import { PuzzlesModalComponent } from '@components/puzzles-modal/puzzles-modal.component';
import * as uuid from 'uuid';
declare const Chessground: ChessgroundConstructor;
declare const Chess: any;


@Component({
  selector: 'app-puzzles',
  templateUrl: 'puzzles.page.html',
  styleUrls: ['puzzles.page.scss'],
})
export class PuzzlesPage implements AfterViewInit {

  public currentPuzzle: PuzzleInterface;
  public currentPuzzlePointer: number;
  public userColor: Color;
  public board: ChessgroundInterface;
  public game: ChessInstance;
  public boardId: string;
  public userRating: number;
  public allPuzzles: PuzzleInterface[];
  public puzzlesToMakeANewRequest = 10;
  public failed = false;
  public theme = 'all';

  constructor(
    private popoverController: PopoverController,
    private requestService: RequestService,
    public modalController: ModalController,
    private gameService: GamesService
  ) { }

  ngAfterViewInit() {
    this.boardId = uuid.v4();
    this.userRating = this.gameService.getUserRating();
    this.setPuzzleData();
  }

  public setPuzzleData(){
    if (this.theme === 'all') {
      this.requestService.getPuzzlesFromRating(this.userRating).subscribe(data => {
        this.allPuzzles = data;
        this.currentPuzzle = this.allPuzzles.splice(Math.floor(Math.random() * this.allPuzzles.length), 1)[0];
        this.initPosition();
      });
    } else {
      this.requestService.getPuzzlesFromTheme(this.theme).subscribe(data => {
        this.allPuzzles = data.filter(e => e.rating < this.userRating + 500 && e.rating > this.userRating - 500);
        this.currentPuzzle = this.allPuzzles.splice(Math.floor(Math.random() * this.allPuzzles.length), 1)[0];
        this.initPosition();
      });
    }
  }

  public initPosition() {
    this.failed = false;
    this.currentPuzzle.movesArray = this.currentPuzzle.moves.trim().split(' ');
    this.currentPuzzlePointer = 0;
    this.game = new Chess(this.currentPuzzle.fen);
    this.userColor = this.currentPuzzle.fen.split(' ')[1] === 'w' ? 'black' : 'white';
    this.board = Chessground(document.getElementById(this.boardId), {
      orientation: this.userColor,
      fen: this.currentPuzzle.fen,
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
    setTimeout(() => {
      this.makeComputerMove(this.currentPuzzle.movesArray[this.currentPuzzlePointer]);
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

      if (move === this.currentPuzzle.movesArray[this.currentPuzzlePointer]) {
        this.game.move(move, { sloppy: true });
        this.currentPuzzlePointer++;
        if (this.currentPuzzle.movesArray.length === this.currentPuzzlePointer) {
          this.puzzleSolved();
        } else {
          this.makeComputerMove(this.currentPuzzle.movesArray[this.currentPuzzlePointer]);
        }
      } else {
        // Wrong move
        this.failed = true;
        setTimeout(() => {
          this.board.set({
            turnColor: this.userColor,
            fen: this.game.fen(),
            lastMove: this.getLastMove(1),
            movable: {
              color: this.userColor,
              dests: this.toDests()
            }
          });
        }, 200);
      }
    };
  }

  private getLastMove(index: number): Key[] {
    const lastMove = this.currentPuzzle.movesArray[this.currentPuzzlePointer - index];
    const res = [];
    res.push(lastMove.substring(0, 2));
    res.push(lastMove.substring(2));
    return res;
  }

  private makeComputerMove(move: string) {
    this.game.move(move, { sloppy: true });
    this.board.set({
      fen: this.game.fen(),
      lastMove: this.getLastMove(0),
      turnColor: this.userColor,
      movable: {
        color: this.userColor,
        dests: this.toDests()
      }
    });
    this.currentPuzzlePointer++;
  }

  private toDests(): Map<Key, Key[]> {
    const dests = new Map();
    this.game.SQUARES.forEach(s => {
      const ms = this.game.moves({ square: s, verbose: true });
      if (ms.length) { dests.set(s, ms.map(m => m.to)); }
    });
    return dests;
  }

  public puzzleSolved() {
    this.userRating = this.getNewRating(this.userRating, this.currentPuzzle.rating, this.failed ? 0 : 1);
    this.gameService.setUserRating(this.userRating);
    this.currentPuzzle = this.allPuzzles.splice(Math.floor(Math.random() * this.allPuzzles.length), 1)[0];
    setTimeout(() => {
      this.initPosition();
    }, 1000);
  }

  public nextPuzzle() {
    if (this.failed) {
      this.userRating = this.getNewRating(this.userRating, this.currentPuzzle.rating, this.failed ? 0 : 1);
      this.gameService.setUserRating(this.userRating);
    }
    this.currentPuzzle = this.allPuzzles.splice(Math.floor(Math.random() * this.allPuzzles.length), 1)[0];
    this.initPosition();
  }

  public getNewRating(myRating: number, opponentRating: number, myGameResult: number) {
    if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
      return null;
    }
    const myChanceToWin = 1 / ( 1 + Math.pow(10, (opponentRating - myRating) / 400));
    return myRating + (Math.round(32 * (myGameResult - myChanceToWin)));
  }

  public showSolution(){
    this.failed = true;
    const match = this.currentPuzzle.movesArray[this.currentPuzzlePointer].match(/^([a-h][1-8])([a-h][1-8])/);
    this.board.set({
      drawable: { shapes: [] }
    });
    this.board.set({
      drawable: { shapes: [{ orig: match[1], dest: match[2], brush: 'blue' }] }
    });
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
        this.setPuzzleData();
      }
    });
  }
}
