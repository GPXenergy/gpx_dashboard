import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { GroupMeterViewComponent } from './group-meter-view.component';
import { GPXSharedModule } from '@gpx/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GroupMeterModule } from '@gpx/components/group-meter/group-meter.module';
import { MatButtonModule } from '@angular/material/button';

const routes: Route[] = [
  {
    path: '',
    component: GroupMeterViewComponent
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
    GroupMeterViewComponent
  ]
})
export class GroupMeterViewModule {
}
