import { Component, AfterViewInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage implements AfterViewInit {

  public languages = [{key: 'en', value: 'English'}, {key: 'es', value: 'Español'}];
  public language = 'en';

  constructor(private storage: Storage) {
  }

  ngAfterViewInit() {
  }

  updateLanguage(){
    this.storage.set('language', this.language);
  }

}
