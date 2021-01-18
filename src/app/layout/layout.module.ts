import { NgModule } from '@angular/core';
import { PageLayoutModule } from './page-layout/page-layout.module';

@NgModule({
  imports: [
    PageLayoutModule,
  ],
  exports: [
    PageLayoutModule,
  ]
})
export class LayoutModule {
}
