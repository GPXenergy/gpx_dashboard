import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './simple-popup.component';
import { OverlayModule } from '@angular/cdk/overlay';


@NgModule({
  declarations: [
    PopupComponent,
  ],
  imports: [
    CommonModule,
    OverlayModule
  ], exports: [
    PopupComponent,
    OverlayModule
  ]
})
export class PopupModule {
}
