import { Component, AfterViewInit, Type } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { PuzzleInterface } from '@app/interfaces/game.interface';
import { ChessgroundConstructor, Key, Color, ChessgroundInterface } from 'src/libs/chessground/types/chessground';
import { ChessInstance } from '@libs/chess.js/chessInterface';
import { PromotionModalComponent } from '@components/promotion-modal/promotion-modal.component';
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

  constructor(
    private popoverController: PopoverController
  ) { }

  ngAfterViewInit() {
    this.boardId = uuid.v4();
    // this.game = new Chess();
    this.currentPuzzle =   {
      fen: '1k1r3r/2q5/pp1n2p1/8/1Q6/3R2P1/PPP2P1P/3R2K1 b - - 4 29',
      moves: 'c7c5 b4c5 b6c5 d3d6 d8d6 d1d6',
      rating: 1553,
      gameUrl: 'https://lichess.org/ceS0QvtT/black#58'
    };
    setTimeout(() => {
      this.initPosition();
    }, 200);
  }

  public initPosition() {
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
    console.log(`%c congrats`, `background: #df03fc; color: #f8fc03`);
  }
}
