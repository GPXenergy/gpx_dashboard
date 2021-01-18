import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SetupViewComponent } from './setup-view.component';
import { GPXSharedModule } from '@gpx/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GroupMeterModule } from '@gpx/components/group-meter/group-meter.module';
import { MatButtonModule } from '@angular/material/button';
import { ManualViewComponent } from './manual-view.component';

const routes: Route[] = [
  {
    path: '',
    component: ManualViewComponent
  },
  {
    path: 'setup',
    component: SetupViewComponent
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
    SetupViewComponent,
    ManualViewComponent,
  ]
})
export class ManualViewModule {
}
