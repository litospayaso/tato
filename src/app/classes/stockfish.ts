import { LineInterface } from '@interfaces/line.interface';
declare const STOCKFISH: any;

export class Stockfish {
  private stockfish: any;
  public bestmove: string;
  public evaluation = 0;
  public level: number;
  public multiline: number;
  public depth: number;
  public lines: LineInterface[] = [];
  public position: string;

  constructor(level = 5, depth = 1, multiline = 0) {
    this.level = level;
    this.multiline = multiline;
    this.depth = depth;
    this.stockfish = new STOCKFISH();
    this.stockfish.onmessage = this.onMessage.bind(this);
    this.initStockfish();
  }

  private onMessage(event: string) {
    if (event && event.includes) {
      if (event.includes('Total evaluation:')) {
        this.evaluation = Number(event.match(/(-?[0-9]+.[0-9]+)/g)[0]);
        this.emmiter('evaluation');
      }
      if (event.includes('bestmove ') && !event.includes('none')) {
        const match = event.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
        this.bestmove = `${match[1]}${match[2]}${match[3] ? match[3] : ''}`;
        this.emmiter('bestmove');
      }
      if (event.includes('info ') && event.includes('multipv')) {
        const lines = event.match(/pv (([a-h][1-8][a-h][1-8][qrbk]? )+)/);
        const thread = event.match(/multipv ([1-9])/);
        const evaluation = event.match(/score (cp|mate) (-?[0-9]+)/);
        if (lines && thread && evaluation) {
          this.lines[Number(thread[1]) - 1] = {
            thread: Number(thread[1]),
            evaluation: evaluation[1] === 'mate' ? Number(evaluation[2]) : Number(evaluation[2]) / 100,
            mate: evaluation[1] === 'mate',
            moves: lines[1].split(' ').filter(e => e !== '')
          };
          this.lines = JSON.parse(JSON.stringify(this.lines));
        }
        // this.lines = this.lines.sort((a, b) => a.evaluation - b.evaluation);
        this.emmiter('multipv');
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
    if (this.multiline > 0) {
      this.stockfish.postMessage(`setoption name MultiPV value ${this.multiline}`);
    }
    this.stockfish.postMessage('ucinewgame');
    this.stockfish.postMessage('isready');
  }

  public evalPosition(moves: string) {
    this.position = moves;
    this.stockfish.postMessage(`position startpos moves ${moves}`);
    this.stockfish.postMessage('eval');
    this.stockfish.postMessage(`go depth ${this.depth} wtime 300000 winc 2000 btime 300000 binc 2000`);
    this.stockfish.postMessage('eval');
  }

  public emmiter(event: string) {
  }

}
