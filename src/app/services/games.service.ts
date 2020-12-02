import { Injectable } from '@angular/core';
import { GameInterface } from '@interfaces/game.interface';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private allData: GameInterface[];

  constructor() {
    const data = localStorage.getItem('gamesDatabase');
    if (data) {
      this.allData = JSON.parse(data);
    } else {
      this.allData = [];
    }
    console.log(`%c data`, `background: #df03fc; color: #f8fc03`, data);
  }

  public getGames(): GameInterface[] {
    const result = JSON.parse(JSON.stringify(this.allData));
    return result;
  }

  public addGame(game: GameInterface) {
    this.allData.push(game);
    localStorage.setItem('gamesDatabase', JSON.stringify(this.allData));
  }

}
