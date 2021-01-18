import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ToolbarComponent } from './toolbar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { GPXSharedModule } from '@gpx/shared.module';

@NgModule({
  declarations: [
    ToolbarComponent,
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    FlexLayoutModule,
    CommonModule,
    RouterModule,
    MatCardModule,
    MatDividerModule,
    GPXSharedModule
  ],
  exports: [
    ToolbarComponent
  ]
})
export class ToolbarModule {
}
