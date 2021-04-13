import { Component, OnChanges, Input } from '@angular/core';
import { LineInterface } from '@app/interfaces/line.interface';
import { ignoreElements } from 'rxjs/operators';
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
  private updateTimer: any;

  constructor() { }

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
    console.log(`%c this.game.turn()`, `background: #df03fc; color: #f8fc03`, this.game.turn());
    if (this.game.turn() === 'b') {
      this.lines = this.lines.sort((a,b) => a.evaluation - b.evaluation);
    }
  }

  getSloppyHistory() {
    return this.game.history({verbose: true}).map(e => `${e.from}${e.to}`);
  }

  getCurrentMovementNumber() {
    const movements = this.game.history().length;
    return ((movements / 2) + 1) % 1 ? `${Math.trunc((movements / 2) + 1)}...` : `${Math.trunc((movements / 2) + 1)}.` ;
  }
}
