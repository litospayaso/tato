# all steps

```bash
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

```typescript
 import { IonicStorageModule } from '@ionic/storage';

 import { IonicStorageModule } from '@ionic/storage-angular';
```

```bash

npx ng update @angular/core@17 @angular/cli@17 --force
nvm use 20.17.0
npx ng update @angular/core@18 @angular/cli@18 --force

```

- Añadir aquí un angular.json que funcione de angular 18.

```bash

npm install --save @ionic-native/splash-screen --force
npm install --save @ionic-native/status-bar --force
npm install --save @ionic/storage --force

```

- reemplazar el storage:

```typescript

  constructor(private store: Storage) {
    this.createDatabase();
  }
  
  public async createDatabase() {
    this.storage = new Storage();
    await this.storage.create();
  }

```

- reemplazar popover:

- Actualizar el `package.json` con las versiones correctas del capacitor:

```json
{
  "dependencies": {
    "@angular/animations": "^18.0.0",
    "@angular/common": "^18.0.0",
    "@angular/compiler": "^18.0.0",
    "@angular/core": "^18.0.0",
    "@angular/forms": "^18.0.0",
    "@angular/platform-browser": "^18.0.0",
    "@angular/platform-browser-dynamic": "^18.0.0",
    "@angular/router": "^18.0.0",
    "@capacitor/android": "6.1.2",
    "@capacitor/app": "6.0.1",
    "@capacitor/core": "6.1.2",
    "@capacitor/haptics": "6.0.1",
    "@capacitor/keyboard": "6.0.2",
    "@capacitor/status-bar": "6.0.1",
    "@ionic/angular": "^8.0.0",
    "ionicons": "^7.0.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.14.2"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^18.0.0",
    "@angular-eslint/builder": "^18.0.0",
    "@angular-eslint/eslint-plugin": "^18.0.0",
    "@angular-eslint/eslint-plugin-template": "^18.0.0",
    "@angular-eslint/schematics": "^18.0.0",
    "@angular-eslint/template-parser": "^18.0.0",
    "@angular/cli": "^18.0.0",
    "@angular/compiler-cli": "^18.0.0",
    "@angular/language-service": "^18.0.0",
    "@capacitor/cli": "6.1.2",
    "@ionic/angular-toolkit": "^11.0.1",
    "@types/jasmine": "~5.1.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "eslint": "^8.57.0",
    "jasmine-core": "~5.1.0",
    "karma": "~6.4.0",
    "karma-chrome-launcher": "~3.2.0",
    "karma-coverage": "~2.2.0",
    "karma-jasmine": "~5.1.0",
    "karma-jasmine-html-reporter": "~2.1.0",
    "typescript": "~5.4.0"
  }
}
```

- Borrar `package.json` dependencies

```json
{
  "dependencies": {
    "@ionic-native/core": "^5.0.0",
    "@ionic-native/http": "^5.32.1",
    "@ionic-native/splash-screen": "^5.36.0",
    "@ionic-native/status-bar": "^5.36.0",
    "@ionic/angular-server": "^7.8.6",
    "@ionic/storage": "^2.3.1",
  },
  "devDependencies": {
    "@types/jasminewd2": "~2.0.3",
    "karma-coverage-istanbul-reporter": "~3.0.2",
  }
}
```

Después de esto borrar `node_modules` y ejecutar `npm install` sin el flag force.

- borrar unused imports
in `app.module.ts`

```typescript
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RouteReuseStrategy } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';
```

in `app.component.ts`

```typescript
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

...

  this.platform.ready().then(() => {
    this.statusBar.styleDefault();
    this.splashScreen.hide();
  });
```

añadir Browser module import en `app.module.ts`

```typescript
import { BrowserModule } from '@angular/platform-browser';
```

- Build APK

```bash
ionic capacitor add android

ionic build
ionic capacitor copy android && cd android && .\gradlew assembleDebug && cd ..

android/app/build/outputs/apk/debug/app-debug.apk
```
