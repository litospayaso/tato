import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { GameInterface } from '@interfaces/game.interface';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private allData: GameInterface[] = [];

  constructor(private storage: Storage) {
    storage.get('gamesDatabase').then((data) => {
      if (data) {
        this.allData = JSON.parse(data);
      } else {
        this.allData = [];
      }
    });
  }

  public getGames(): GameInterface[] {
    const result = JSON.parse(JSON.stringify(this.allData));
    return result;
  }

  public addGame(game: GameInterface) {
    this.allData.push(game);
    this.storage.set('gamesDatabase', JSON.stringify(this.allData));
  }

}
