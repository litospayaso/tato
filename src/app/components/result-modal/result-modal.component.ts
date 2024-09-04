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

  constructor(public modalController: ModalController) {
  }

  ngOnInit() {
  }

  public closeModal(value: string) {
    this.modalController.dismiss({data: value});
  }
  public cancel() {
    this.modalController.dismiss();
  }
}
