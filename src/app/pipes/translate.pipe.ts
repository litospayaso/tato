import { Pipe, PipeTransform } from '@angular/core';
import { Storage } from '@ionic/storage';
import translations from '@resources/translations.json';

@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {

  constructor(private storage: Storage) {
  }

  transform(text: string): Promise<string> {
    return new Promise(resolve => {
      this.storage.get('language').then(lan => {
        if (translations && translations[lan] && translations[lan][text]) {
          return resolve(translations[lan][text]);
        } else {
          return resolve(text);
        }
      });
    });
  }
}
