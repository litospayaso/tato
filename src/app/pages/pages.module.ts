import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PercentagePipe } from '@pipes/percentage.pipe';

import { HomePage } from '@pages/home/home.page';
import { TrainingPage } from '@pages/training/training.page';

import { BoardComponent } from '@components/board/board.component';
import { MovesTableComponent } from '@components/moves-table/moves-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule
  ],
  declarations: [
    PercentagePipe,
    HomePage,
    TrainingPage,
    BoardComponent,
    MovesTableComponent
  ]
})
export class PagesModule {}
