import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DefaultEndingsValuesInterface } from '@interfaces/game.interface';


@Component({
  selector: 'app-endings-modal',
  templateUrl: './endings-modal.component.html',
  styleUrls: ['./endings-modal.component.scss'],
})
export class EndingsModalComponent implements OnInit {

  // public opening = `Bishop's Opening`;
  public themes = ['all', 'pawnEnding', 'queenEnding', 'rookEnding', 'minorPiecesEnding', 'bishopvsknigth', 'bishopvsbishop', 'bishopvspawns', 'knightvspawns', 'queenvsrook', 'queenvsminorPieces', 'rookvsminorPieces', 'middlegameEnding', 'draw'];
  public theme = `all`;
  public dificultyValue = 3;
  public dificultyValues = [
    'veryEasy',
    'Easy',
    'Medium',
    'Hard',
    'veryHard'
  ];
  @Input() defaultEndingsValues: DefaultEndingsValuesInterface;

  constructor(public modalController: ModalController) {
  }

  ngOnInit() {
    if (this.defaultEndingsValues && this.defaultEndingsValues.theme && this.defaultEndingsValues.dificulty) {
      this.theme = this.defaultEndingsValues.theme;
      this.dificultyValue = this.dificultyValues.indexOf(this.defaultEndingsValues.dificulty);
    }
  }

  public closeModal() {
    this.modalController.dismiss({
      theme: this.theme,
      dificulty: this.dificultyValues[this.dificultyValue]
    });
  }

  public cancel() {
    this.modalController.dismiss();
  }

}
