import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PublicGroupMeterViewComponent } from './public-group-meter-view.component';
import { GPXSharedModule } from '@gpx/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GroupMeterModule } from '@gpx/components/group-meter/group-meter.module';
import { MatButtonModule } from '@angular/material/button';

const routes: Route[] = [
  {
    path: ':slug',
    component: PublicGroupMeterViewComponent
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    GPXSharedModule,
    GroupMeterModule,
    MatProgressBarModule,
    MatDividerModule,
    MatButtonModule
  ],
  declarations: [
    PublicGroupMeterViewComponent
  ]
})
export class PublicGroupMeterViewModule {
}
