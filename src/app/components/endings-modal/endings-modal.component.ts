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
    {value: 'veryEasy', text: 'Very easy'},
    {value: 'Easy', text: 'Easy'},
    {value: 'Medium', text: 'Medium'},
    {value: 'Hard', text: 'Hard'},
    {value: 'veryHard', text: 'Very hard'},
  ];
  @Input() defaultEndingsValues: DefaultEndingsValuesInterface;

  constructor(public modalController: ModalController) {
  }

  ngOnInit() {
    if (this.defaultEndingsValues && this.defaultEndingsValues.theme && this.defaultEndingsValues.dificulty) {
      this.theme = this.defaultEndingsValues.theme;
      this.dificultyValue = this.dificultyValues.indexOf(this.dificultyValues.find(e => e.value === this.defaultEndingsValues.dificulty));
    }
  }

  public closeModal() {
    this.modalController.dismiss({
      theme: this.theme,
      dificulty: this.dificultyValues[this.dificultyValue].value
    });
  }

  public cancel() {
    this.modalController.dismiss();
  }

}
