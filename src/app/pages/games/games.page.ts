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

  public allGames: GameInterface[];
  constructor(private gamesService: GamesService) {
    this.gamesService.reloadData();
  }

  ngAfterViewInit() {
    this.allGames = this.gamesService.getGames();
    this.allGames = this.allGames.sort((b, a) => 
      new Date(
        Number(a.date.split(',')[0].trim().split('/')[2]),
        Number(a.date.split(',')[0].trim().split('/')[1]),
        Number(a.date.split(',')[0].trim().split('/')[0]),
        Number(a.date.split(',')[1].trim().split(':')[0]),
        Number(a.date.split(',')[1].trim().split(':')[1]),
        Number(a.date.split(',')[1].trim().split(':')[2]),
      ).getTime() - new Date(
        Number(b.date.split(',')[0].trim().split('/')[2]),
        Number(b.date.split(',')[0].trim().split('/')[1]),
        Number(b.date.split(',')[0].trim().split('/')[0]),
        Number(b.date.split(',')[1].trim().split(':')[0]),
        Number(b.date.split(',')[1].trim().split(':')[1]),
        Number(b.date.split(',')[1].trim().split(':')[2]),
      ).getTime()
    );
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
