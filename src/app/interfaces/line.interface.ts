export interface LineInterface {
    thread: number;
    evaluation: number;
    moves: string[];
    mate: boolean;
    algebraicMoves?: string[];
}
