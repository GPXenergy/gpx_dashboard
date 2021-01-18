import { NgModule } from '@angular/core';
import { OanaxSnackBarComponent } from './oanax-snack-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    OanaxSnackBarComponent,
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
export class OanaxSnackBarModule {
}
