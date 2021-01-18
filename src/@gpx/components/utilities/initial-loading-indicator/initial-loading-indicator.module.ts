import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatProgressBarModule } from '@angular/material/progress-bar';

import { InitialLoadingIndicatorComponent } from './initial-loading-indicator.component';

@NgModule({
  declarations: [
    InitialLoadingIndicatorComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatProgressBarModule
  ],
  exports: [
    InitialLoadingIndicatorComponent
  ]
})
export class InitialLoadingIndicatorModule {
}
