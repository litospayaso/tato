import { Component, AfterViewInit, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, ViewChild } from '@angular/core';
import { GameInterface } from '@app/interfaces/game.interface';
import { ArrowComponent } from '../arrow/arrow.component';
// import { GamesService } from '@services/games.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BoardComponent implements AfterViewInit, OnChanges {

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
  @ViewChild('arrowElement') arrowElement: ArrowComponent;
  public inCheck = false;

  constructor(
    // private gamesService: GamesService
  ) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resizeBoard();
    }, 1000);

    window.onresize = this.resizeBoard.bind(this);
    window.onfocus = this.resizeBoard.bind(this);
    document.addEventListener('visibilitychange', this.resizeBoard.bind(this), false);
  }

  resizeBoard() {
    this.width = `${document.querySelector(`#${this.boardId}`).parentElement.getBoundingClientRect().width}px`;
    if (this.board) {
      this.board.resize();
    }
    this.resizeEmitter.emit();
    this.arrowElement.updateLine();
  }

  ngOnChanges(changes) {
    if (changes.turn) {
      this.updateStatus();
    }
    // this.updateStatus();
  }

  getPgn() {
    const dummy = document.createElement('textarea');
    // dummy.style.display = 'none';
    document.body.appendChild(dummy);
    dummy.value = this.savedGame.pgn;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  }

  updateStatus() {
    this.inCheck = this.game.in_check();
    // let status = '';

    // let moveColor = 'White';
    // if (this.game.turn() === 'b') {
    //   moveColor = 'Black';
    // }

    // // checkmate?
    // if (this.game.in_checkmate()) {
    //   this.gamesService.addGame({
    //     date: new Date().toLocaleString(),
    //     pgn: this.game.pgn(),
    //     title: 'Game against Computer level 5'
    //   });
    // }

    // // draw?
    // else if (this.game.in_draw()) {
    //   status = 'Game over, drawn position';
    // }

    // // game still on
    // else {
    //   status = moveColor + ' to move';

    //   // check?
    //   if (this.game.in_check()) {
    //     status += ', ' + moveColor + ' is in check';
    //   }
    // }
  }

}
