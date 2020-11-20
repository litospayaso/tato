import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { HomePage } from '@pages/home/home.page';
import { TrainingPage } from '@pages/training/training.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule
  ],
  declarations: [
    HomePage,
    TrainingPage
  ]
})
export class PagesModule {}
