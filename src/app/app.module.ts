import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage-angular';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { PagesModule } from '@pages/pages.module';
import { SharedModule } from '@shared/shared.module';

import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    SharedModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    BrowserModule,
    PagesModule
  ], 
  providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppModule { }
