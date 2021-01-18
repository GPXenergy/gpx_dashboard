import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FooterComponent } from './footer.component';
import { GPXSharedModule } from '@gpx/shared.module';


@NgModule({
  declarations: [
    FooterComponent
  ],
  imports: [
    GPXSharedModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  exports: [
    FooterComponent
  ]
})
export class FooterModule {
}
