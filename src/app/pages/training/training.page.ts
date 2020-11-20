import { Component, OnInit } from '@angular/core';
declare const Chessboard: any;
declare const Chess: any;

@Component( {
  selector: 'app-training',
  templateUrl: 'training.page.html',
  styleUrls: ['training.page.scss'],
} )
export class TrainingPage implements OnInit {
  public board: any;
  public game: any;

  constructor() {
    this.game = new Chess();
  }

  ngOnInit() {
    // this.game = new Chess();
    this.board = Chessboard( 'trainingBoard', 'start' );
    window.setTimeout( () => { this.makeRandomMove(); }, 500 );
  }

  private makeRandomMove() {
    const possibleMoves = this.game.moves();

    // exit if the game is over
    if ( this.game.game_over() ) {
      return;
    }

    const randomIdx = Math.floor( Math.random() * possibleMoves.length );
    this.game.move( possibleMoves[randomIdx] );
    this.board.position( this.game.fen() );

    window.setTimeout( () => { this.makeRandomMove(); }, 500 );
  }

}
