import { Component, AfterViewInit } from '@angular/core';
import { GameInterface } from '@app/interfaces/game.interface';
import { GamesService } from '@app/services/games.service';
import { ChessgroundConstructor } from 'src/libs/chessground/types/chessground';
declare const Chessground: ChessgroundConstructor;


@Component( {
  selector: 'app-games',
  templateUrl: 'games.page.html',
  styleUrls: ['games.page.scss'],
} )
export class GamesPage implements AfterViewInit {

  private allGames: GameInterface[];
  constructor(private gamesService: GamesService) {}

  ngAfterViewInit() {
    this.allGames = this.gamesService.getGames();
    setTimeout(() => {
      this.allGames.forEach((game, index) => {
        Chessground(document.getElementById(`game-fen-${index}`), {
          orientation: game.userColor === 'w' ? 'white' : 'black',
          fen: game.endingPosition,
          coordinates: false,
          viewOnly: true
        });
      });
    }, 500);
  }

}
