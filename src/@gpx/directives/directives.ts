import {NgModule} from '@angular/core';
import { MaterialElevationDirective } from './style-elevation.directive';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    MaterialElevationDirective,
  ],
  imports: [
    MatTooltipModule
  ],
  exports: [
    MaterialElevationDirective,
  ]
})
export class GPXDirectivesModule {
}
