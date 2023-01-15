import { NgModule } from '@angular/core';
import { TranslatePipe } from '@pipes/translate.pipe';

@NgModule({
  imports: [
  ],
  declarations: [
    TranslatePipe
  ],
  exports: [
    TranslatePipe
  ]
})

export class SharedModule { }