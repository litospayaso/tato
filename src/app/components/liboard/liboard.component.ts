import { Component, AfterViewInit, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, ViewChild } from '@angular/core';
import { GameInterface } from '@app/interfaces/game.interface';
import { ChessgroundConstructor, Key, Color, ChessgroundInterface } from 'src/libs/chessground/types/chessground';
// const Chessground = require('chessground').Chessground;
// import {Chessground} from 'chessground';
// import { GamesService } from '@services/games.service';
declare const Chessground: ChessgroundConstructor;
declare const Chess: any;

@Component({
  selector: 'app-liboard',
  templateUrl: './liboard.component.html',
  styleUrls: ['./liboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LiboardComponent implements AfterViewInit, OnChanges {

  @Input() boardId: string;
  @Input() board: any;
  @Input() game: any;
  @Input() turn: string;
  @Input() bestmove: string;
  @Input() width = '100%';
  @Input() evaluation = 0;
  @Input() showControlButtons = false;
  @Input() savedGame: GameInterface;
  @Output() resizeEmitter = new EventEmitter();
  @Output() moveForward = new EventEmitter();
  @Output() moveBackward = new EventEmitter();

  public inCheck = false;

  constructor(
    // private gamesService: GamesService
  ) {
  }

  ngAfterViewInit() {
    const chess = new Chess();
    // const cg = Chessground(document.getElementById(this.boardId), {
    //   movable: {
    //     color: 'white',
    //     free: false,
    //     dests: this.toDests(chess)
    //   },
    //   highlight: {
    //     check: true
    //   }
    // });
    // cg.set({
    //   movable: {
    //     events: {
    //       after: this.aiPlay(cg, chess, 1000, false)
    //     }
    //   }
    // });


    const cg = Chessground(document.getElementById(this.boardId), {
        movable: {
            color: 'white',
            free: false,
            dests: this.toDests(chess),
        },
        draggable: {
            showGhost: true
        }
    });
    cg.set({
        movable: { events: { after: this.playOtherSide(cg, chess) } }
    });

    // const ground = Chessground(document.getElementById(this.boardId), {
    //   movable: {
    //     color: 'both',
    //     showDests: true
    //   }
    // });
  }


  ngOnChanges(changes) {
    // this.updateStatus();
  }


  toDests(chess: any): Map<Key, Key[]> {
    const dests = new Map();
    chess.SQUARES.forEach(s => {
      const ms = chess.moves({square: s, verbose: true});
      if (ms.length) { dests.set(s, ms.map(m => m.to)); }
    });
    return dests;
  }

  playOtherSide(cg: ChessgroundInterface, chess) {
    return (orig, dest) => {
      chess.move({from: orig, to: dest});

      cg.set({
        turnColor: this.toColor(chess),
        movable: {
          color: this.toColor(chess),
          dests: this.toDests(chess)
        }
      });
    };
  }

  toColor(chess: any): Color {
    return (chess.turn() === 'w') ? 'white' : 'black';
  }

  aiPlay(cg: ChessgroundInterface, chess: any, delay: number, firstMove: boolean) {
    return (orig, dest) => {
      chess.move({from: orig, to: dest});
      setTimeout(() => {
        const moves = chess.moves({verbose: true});
        const move = firstMove ? moves[0] : moves[Math.floor(Math.random() * moves.length)];
        chess.move(move.san);
        cg.move(move.from, move.to);
        cg.set({
          highlight: {
            check: true
          },
          turnColor: this.toColor(chess),
          movable: {
            color: this.toColor(chess),
            dests: this.toDests(chess)
          }
        });
        cg.playPremove();
      }, delay);
    };
  }

}
