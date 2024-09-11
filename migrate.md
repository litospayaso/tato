# all steps

``` bash
nvm install 18.19.0
nvm use 18.19.0
npx ng update @angular/core@11 @angular/cli@11
npx ng update
- remove @ngrx/store from package.json
npx ng update @angular/core@12 @angular/cli@12
npm install --force
npx ng update
npx ng update @angular/core@13 @angular/cli@13
npm install --force
npx ng update @angular/core@14 @angular/cli@14 --force
npx ng update @angular/core@15 @angular/cli@15 --force
npm i rxjs@7.8.1
npm install @ionic/angular@6 --force  // HERE THE APP SHOULD WORK (npm start)
npx ng update @angular/core@16 @angular/cli@16 --force
npm install @ionic/angular@7 --force

npm install @ionic/storage-angular@4.0.0 --force
npm install @ionic/angular@latest --force
```

replace:

``` typescript
 import { IonicStorageModule } from '@ionic/storage';

 import { IonicStorageModule } from '@ionic/storage-angular';
```

``` bash

npx ng update @angular/core@17 @angular/cli@17 --force
nvm use 20.17.0
npx ng update @angular/core@18 @angular/cli@18 --force

```

- Añadir aquí un angular.json que funcione de angular 18.

``` bash

npm install --save @ionic-native/splash-screen --force
npm install --save @ionic-native/status-bar --force
npm install --save @ionic/storage --force

```

- reemplazar el storage:

``` typescript

  constructor(private store: Storage) {
    this.createDatabase();
  }
  
  public async createDatabase() {
    this.storage = new Storage();
    await this.storage.create();
  }

```
