import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingIndicatorComponent } from './loading-indicator.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    FlexLayoutModule,
    MatProgressSpinnerModule,
    TranslateModule,
    CommonModule
  ],
  declarations: [
    LoadingIndicatorComponent,
  ],
  exports: [
    LoadingIndicatorComponent,
  ]
})
export class LoadingIndicatorModule {
}
