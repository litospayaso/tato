import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-moves-table',
  templateUrl: './moves-table.component.html',
  styleUrls: ['./moves-table.component.scss'],
})
export class MovesTableComponent implements OnInit {

  @Input() moves: string;

  constructor() { }

  ngOnInit() {}

}
