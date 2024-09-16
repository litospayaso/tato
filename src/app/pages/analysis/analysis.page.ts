import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GamesService } from '@services/games.service';
import { Stockfish } from '@classes/stockfish';
import { GameInterface } from '@app/interfaces/game.interface';
import { ChessgroundConstructor, Key, Color, ChessgroundInterface } from 'src/libs/chessground/types/chessground';
import { PromotionModalComponent } from '@components/promotion-modal/promotion-modal.component';
import { ToastController } from '@ionic/angular';
import * as uuid from 'uuid';
import { ChessInstance } from '@libs/chess.js/chessInterface';
import { TranslatePipe } from '@pipes/translate.pipe';
import { ModalController } from '@ionic/angular';

declare const Chessground: ChessgroundConstructor;
declare const Chess: any;

@Component({
  selector: 'app-analysis',
  templateUrl: 'analysis.page.html',
  styleUrls: ['analysis.page.scss'],
})
export class AnalysisPage implements AfterViewInit {

  public board: ChessgroundInterface;
  public game: ChessInstance;
  public moves: string;
  public algebraicMoves: string[] = [];
  public stockfish: Stockfish = new Stockfish(20, 9, 3);
  public userColor = 'w';
  public turn = 'w';
  public boardMovesPointer: number = undefined;
  public savedGame: GameInterface;
  public gameId: string | number;
  public boardId: string;
  public successMessage: string;
  public evaluation = 0;

  constructor(
    private route: ActivatedRoute,
    private gamesService: GamesService,
    public toastController: ToastController,
    public modalController: ModalController,
    private translate: TranslatePipe
  ) {
    this.boardId = uuid.v4();

    this.translate.transform('copied').then((successMessage) => this.successMessage = successMessage);

    this.game = new Chess();
    this.moves = '';
    this.stockfish.emmiter = this.stockfishEmmiter.bind(this);
    document.onkeydown = this.handleKeyPress.bind(this);
    this.route.params.subscribe(params => {
      const id = params.id;
      if (id) {
        if (gamesService.getGameById(id)) {
          const game = gamesService.getGameById(id);
          this.savedGame = game;
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
        const popover = await this.modalController.create({
          component: PromotionModalComponent,
          componentProps: {
            color: `modal-color-${origPiece.color}`
          }
        });
        await popover.present();
        const promotion = await popover.onDidDismiss();
        // await popover.present();
        move = move.concat(promotion.data ? promotion.data : 'q');
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
      if (this.game.turn() === 'b') {
        this.stockfish.lines = this.stockfish.lines.map(line => {
          line.evaluation = line.evaluation * -1;
          return line;
        });
        this.stockfish.lines = this.stockfish.lines.sort((a, b) => a.evaluation - b.evaluation);
      } else {
        this.stockfish.lines = this.stockfish.lines.sort((a, b) => b.evaluation - a.evaluation);
      }
      if (this.stockfish.lines[0] && this.stockfish.lines[0].moves) {
        this.drawLine(this.stockfish.lines[0].moves[0]);
      }
      if (this.stockfish.lines[0] && this.stockfish.lines[0].evaluation) {
        this.evaluation = this.stockfish.lines[0].evaluation;
      }
    }
  }

  private drawLine(line: string) {
    const match = line.match(/^([a-h][1-8])([a-h][1-8])/);
    this.board.set({
      drawable: { shapes: [] }
    });
    this.board.set({
      drawable: { shapes: [{ orig: match[1], dest: match[2], brush: 'blue' }] }
    });

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

  public async getPgn() {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = this.savedGame.pgn;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    const toast = await this.toastController.create({
      header: this.successMessage,
      duration: 1000,
    });
    await toast.present();
  }
}
