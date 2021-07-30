import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PuzzleInterface } from '@app/interfaces/game.interface';
import { EndingInterface } from '@app/interfaces/ending.interface';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  public getPuzzlesFromRating(rating: number): Observable<PuzzleInterface[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://raw.githubusercontent.com/litospayaso/tato/main/database/rating/${rating.toString().slice(0, -2)}00.json`) as Observable<PuzzleInterface[]>;
  }

  public getPuzzlesFromTheme(theme: string): Observable<PuzzleInterface[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://raw.githubusercontent.com/litospayaso/tato/main/database/themes/${theme}.json`) as Observable<PuzzleInterface[]>;
  }

  public getEndingsFromTheme(theme: string): Observable<EndingInterface[]> {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`https://raw.githubusercontent.com/litospayaso/tato/main/database/endings/${theme}.json`) as Observable<EndingInterface[]>;
  }


}
