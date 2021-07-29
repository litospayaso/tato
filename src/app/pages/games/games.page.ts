import { Component, AfterViewInit } from '@angular/core';
import { GameInterface } from '@app/interfaces/game.interface';
import { GamesService } from '@app/services/games.service';


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
  }

}
