import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';

import { PercentagePipe } from '@pipes/percentage.pipe';

import { HomePage } from '@pages/home/home.page';
import { TrainingPage } from '@pages/training/training.page';
import { AnalysisPage } from '@pages/analysis/analysis.page';

import { BoardComponent } from '@components/board/board.component';
import { ArrowComponent } from '@components/arrow/arrow.component';
import { MovesTableComponent } from '@components/moves-table/moves-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule,
    IonicStorageModule.forRoot(),
  ],
  declarations: [
    PercentagePipe,
    HomePage,
    TrainingPage,
    AnalysisPage,
    BoardComponent,
    ArrowComponent,
    MovesTableComponent
  ]
})
export class PagesModule {}
