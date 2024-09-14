import { Pipe, PipeTransform } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import translations from '@resources/translations.json';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  public storage: Storage;

  constructor(private store: Storage) {
    this.createDatabase();
  }

  public async createDatabase() {
    this.storage = new Storage();
    await this.storage.create();
  }

  transform(text: string): Promise<string> {
    return new Promise(resolve => {
      this.storage.get('language').then(lan => {
        const language = lan ? lan : 'es';
        if (translations && translations[language] && translations[language][text]) {
          return resolve(translations[language][text]);
        } else {
          return resolve(text);
        }
      });
    });
  }
}
