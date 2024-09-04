import { Component, AfterViewInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage implements AfterViewInit {

  public languages = [{key: 'en', value: 'English'}, {key: 'es', value: 'Español'}];
  public language = 'en';

  constructor(
    private storage: Storage,
    public modalController: ModalController
  ) {
  }

  ngAfterViewInit() {
  }

  updateLanguage(){
    this.storage.set('language', this.language);
  }

  public closeModal() {
    this.modalController.dismiss();
  }

}
