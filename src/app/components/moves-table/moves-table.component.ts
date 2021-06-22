import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { GameInterface } from '@app/interfaces/game.interface';
import { LineInterface } from '@app/interfaces/line.interface';
declare const Chess: any;

@Component({
  selector: 'app-moves-table',
  templateUrl: './moves-table.component.html',
  styleUrls: ['./moves-table.component.scss'],
})
export class MovesTableComponent implements OnChanges {

  @Input() moves: string;
  @Input() lines: LineInterface[];
  @Input() game: any;
  @Input() savedGame: GameInterface;
  @Input() resignButton: any = false;
  @Output() resingEmitter = new EventEmitter();
  private updateTimer: any;

  constructor() { }

  public resign() {
    this.resingEmitter.emit();
  }

  ngOnChanges(changes) {
    if (changes.lines) {
      clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(() => {
        this.updateLines();
      }, 800);
    }
  }

  updateLines(){
    this.lines.forEach(line => {
      const game = new Chess();
      game.load_pgn(this.game.history().concat(line.moves).join(' '), {sloppy: true});
      line.algebraicMoves = game.history().slice(this.game.history().length);
    });
    if (this.game.turn() === 'b') {
      this.lines = this.lines.sort((a, b) => a.evaluation - b.evaluation);
    }
  }

  getSloppyHistory() {
    return this.game.history({verbose: true}).map(e => `${e.from}${e.to}${e.promotion ? e.promotion : ''}`);
  }

  getCurrentMovementNumber() {
    const movements = this.game.history().length;
    return ((movements / 2) + 1) % 1 ? `${Math.trunc((movements / 2) + 1)}...` : `${Math.trunc((movements / 2) + 1)}.` ;
  }
}
