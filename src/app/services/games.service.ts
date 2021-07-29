import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { DefaultValuesInterface, GameInterface } from '@interfaces/game.interface';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private allData: GameInterface[] = [];
  private defaultOpeningValues: DefaultValuesInterface = {} as DefaultValuesInterface;
  private userRating = 1300;

  constructor(private storage: Storage) {
    this.reloadData();
  }

  public reloadData() {
    this.storage.get('gamesDatabase').then((data) => {
      if (data) {
        this.allData = JSON.parse(data);
      } else {
        this.allData = [];
      }
    });
    this.storage.get('defaultOpeningValues').then((data) => {
      if (data) {
        this.defaultOpeningValues = JSON.parse(data);
      }
    });
    this.storage.get('userRating').then((data) => {
      if (data) {
        this.userRating = Number(data);
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

  public getDefaultOpeningValues(): DefaultValuesInterface {
    const result = JSON.parse(JSON.stringify(this.defaultOpeningValues));
    return result;
  }

  public setDefaultOpeningValues(defaultOpeningValues: DefaultValuesInterface) {
    this.defaultOpeningValues = defaultOpeningValues;
    this.storage.set('defaultOpeningValues', JSON.stringify(this.defaultOpeningValues));
  }

  public setUserRating(rating: number) {
    this.userRating = rating;
    this.storage.set('userRating', rating);
  }

  public getUserRating() {
    return this.userRating;
  }

}
