import { Component, AfterViewInit, Input, ViewEncapsulation, OnChanges } from '@angular/core';

@Component({
  selector: 'app-arrow',
  templateUrl: './arrow.component.html',
  styleUrls: ['./arrow.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArrowComponent implements AfterViewInit, OnChanges {

  @Input() bestmove: string;

  public arrowId = 'arrowId';
  constructor(
    // private gamesService: GamesService
  ) { }

  ngAfterViewInit() {
  }

  ngOnChanges(changes) {
    if (changes.bestmove) {
      this.updateLine();
    }
  }

  public updateLine() {
    if (this.bestmove) {
      const arrowElement = document.getElementById(this.arrowId);
      if (arrowElement) {
        const oldLine = arrowElement.querySelector('line');
        if (oldLine) {
          oldLine.remove();
        }
        const match = this.bestmove.match(/^([a-h][1-8])([a-h][1-8])/);
        const from = document.querySelector(`[data-square="${match[1]}"]`).getBoundingClientRect();
        const to = document.querySelector(`[data-square="${match[2]}"]`).getBoundingClientRect();
        const offsite = from.width;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', (from.x + (offsite / 2)).toString());
        line.setAttribute('y1', (from.y - (offsite / 2)).toString());
        line.setAttribute('x2', (to.x + (offsite / 2)).toString());
        line.setAttribute('y2', (to.y - (offsite / 2)).toString());
        line.setAttribute('fill', 'url(#arrowGradiant)');
        line.setAttribute('marker-end', 'url(#arrowhead)');
        arrowElement.append(line);
      }
    }
  }

}
