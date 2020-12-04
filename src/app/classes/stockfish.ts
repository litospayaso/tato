declare const STOCKFISH: any;

export class Stockfish {
  private stockfish: any;
  public bestMove: string;
  public evaluation = 0;
  public level = 5;

  constructor() {
    this.stockfish = new STOCKFISH();
    this.stockfish.onmessage = this.onMessage.bind(this);
    this.initStockfish();
  }

  private onMessage(event) {
    if (event && event.includes) {
      if (event.includes('Total evaluation:')) {
        this.evaluation = Number(event.match(/(-?[0-9]+.[0-9]+)/g)[0]);
        this.emmiter('evaluation');
      }
      if (event.includes('bestmove ') && !event.includes('none')) {
        const match = event.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
        this.bestMove = `${match[1]}${match[2]}${match[3] ? match[3] : ''}`;
        this.emmiter('bestmove');
      }
    }
  }

  private initStockfish() {
    this.stockfish.postMessage('uci');
    // this.stockfish.postMessage('setoption name Skill Level value 20');
    this.stockfish.postMessage(`setoption name Skill Level value ${this.level}`);
    this.stockfish.postMessage('setoption name Contempt Factor value 0');
    this.stockfish.postMessage('setoption name Skill Level value 0');
    this.stockfish.postMessage('setoption name Skill Level Maximum Error value 10');
    this.stockfish.postMessage('setoption name Skill Level Probability value 1');
    this.stockfish.postMessage('setoption name King Safety value 0');
    this.stockfish.postMessage('setoption name Skill Level value 0');
    this.stockfish.postMessage('setoption name Skill Level Maximum Error value 10');
    this.stockfish.postMessage('setoption name Skill Level Probability value 1');
    this.stockfish.postMessage('ucinewgame');
    this.stockfish.postMessage('isready');
  }

  public evalPosition(moves: string) {
    this.stockfish.postMessage(`position startpos moves ${moves}`);
    this.stockfish.postMessage('eval');
    this.stockfish.postMessage('go depth 2 wtime 300000 winc 2000 btime 300000 binc 2000');
    this.stockfish.postMessage('eval');
  }

  public emmiter(event: string) {
  }


}
