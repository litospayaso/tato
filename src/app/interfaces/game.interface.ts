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
