export interface GameInterface {
    date: string;
    pgn: string;
    title: string;
    movesVerbose: string;
    userColor: string;
    opening: string;
    endingPosition: string;
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