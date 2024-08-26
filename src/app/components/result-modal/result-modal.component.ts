import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-result-modal',
  templateUrl: './result-modal.component.html',
  styleUrls: ['./result-modal.component.scss'],
})
export class ResultModalComponent implements OnInit {

  @Input() result: string;
  @Input() userColor: string;

  public gameResult: 'win' | 'draw' | 'lose';

  constructor(public modalController: ModalController) {
  }

  ngOnInit() {
    if (this.result === '1-0' && this.userColor === 'w' || this.result === '0-1' && this.userColor === 'b') {
      this.gameResult = 'win';
    }
    if (this.result === '1/2 - 1/2') {
      this.gameResult = 'draw';
    }
    if (this.result === '1-0' && this.userColor === 'b' || this.result === '0-1' && this.userColor === 'w') {
      this.gameResult = 'lose';
    }
  }

  public closeModal(value: string) {
    this.modalController.dismiss({data: value});
  }
  public cancel() {
    this.modalController.dismiss();
  }
}
