import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule } from '@ngx-translate/core';
import { GPXPipesModule } from '@gpx/pipes/pipes.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GPXDirectivesModule } from '@gpx/directives/directives';


@NgModule({
  imports: [],
  exports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    TranslateModule,
    GPXPipesModule,
    MatSnackBarModule,
    MatTooltipModule,
    GPXDirectivesModule
  ],
})
export class GPXSharedModule {
}
