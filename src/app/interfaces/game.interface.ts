export interface GameInterface {
    id: string;
    date: string;
    pgn: string;
    movesVerbose: string;
    userColor: string;
    opening?: string;
    initPosition?: string;
    endingPosition: string;
    gameResult: string;
    theme?: string;
}

export interface DefaultValuesInterface {
  opening: string;
  userColor: string;
}

export interface DefaultEndingsValuesInterface {
  dificulty: string;
  theme: string;
}

export interface PuzzleInterface {
  fen: string;
  moves: string;
  movesArray?: string[];
  rating: number;
  gameUrl: string;
}