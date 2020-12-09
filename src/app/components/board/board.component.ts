import { Component, AfterViewInit, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, ViewChild } from '@angular/core';
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
  @Output() resizeEmitter = new EventEmitter();
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
    //   console.log(`%c this.game.pgn()`, `background: #df03fc; color: #f8fc03`, this.game.pgn());
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
