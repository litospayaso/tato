import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-puzzles-modal',
  templateUrl: './puzzles-modal.component.html',
  styleUrls: ['./puzzles-modal.component.scss'],
})
export class PuzzlesModalComponent implements OnInit {
  public themes = ['all', 'crushing', 'hangingPiece', 'long', 'middlegame', 'advantage', 'endgame', 'short', 'master', 'advancedPawn', 'kingsideAttack', 'quietMove', 'trappedPiece', 'pin', 'backRankMate', 'mate', 'mateIn2', 'fork', 'masterVsMaster', 'skewer', 'superGM', 'opening', 'discoveredAttack', 'oneMove', 'veryLong', 'exposedKing', 'rookEndgame', 'defensiveMove', 'deflection', 'promotion', 'mateIn1', 'clearance', 'equality', 'sacrifice', 'knightEndgame', 'pawnEndgame', 'attraction', 'queensideAttack', 'queenRookEndgame', 'hookMate', 'intermezzo', 'bishopEndgame', 'xRayAttack', 'capturingDefender', 'mateIn3', 'queenEndgame', 'interference', 'doubleCheck', 'zugzwang', 'smotheredMate', 'mateIn4', 'enPassant', 'castling', 'arabianMate', 'attackingF2F7', 'mateIn5', 'doubleBishopMate', 'anastasiaMate', 'dovetailMate', 'bodenMate', 'underPromotion'];
  @Input() theme: string;

  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  public closeModal() {
    this.modalController.dismiss({
      theme: this.theme
    });
  }
}
