import { NgModule } from '@angular/core';
import { GpxSnackBarComponent } from './gpx-snack-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    GpxSnackBarComponent,
  ],
  imports: [
    TranslateModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatSnackBarModule,
  ]
})
export class GpxSnackBarModule {
}
