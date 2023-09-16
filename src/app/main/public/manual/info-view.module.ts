import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { SetupViewComponent } from './setup-guide/setup-view.component';
import { GPXSharedModule } from '@gpx/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GroupMeterModule } from '@gpx/components/group-meter/group-meter.module';
import { MatButtonModule } from '@angular/material/button';
import { InfoViewComponent } from './info-view.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { GpxConnectorManualViewComponent } from './gpxc-manual/gpx-connector-manual-view.component';
import { DashboardManualViewComponent } from './dashboard-manual/dashboard-manual-view.component';
import { FaqComponent } from './faq/faq.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { QuestionPanelComponent } from './faq/question-panel/question-panel.component';

const routes: Route[] = [
  {
    path: '',
    component: InfoViewComponent
  },
  {
    path: 'faq',
    component: FaqComponent
  },
  {
    path: 'setup',
    component: SetupViewComponent
  },
  {
    path: 'gpxconnector',
    component: GpxConnectorManualViewComponent
  },
  {
    path: 'dashboard',
    component: DashboardManualViewComponent
  },
];


@NgModule({
  imports: [
    RouterModule.forChild(routes),
    GPXSharedModule,
    GroupMeterModule,
    MatProgressBarModule,
    MatDividerModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
  ],
  declarations: [
    InfoViewComponent,
    FaqComponent,
    QuestionPanelComponent,
    SetupViewComponent,
    GpxConnectorManualViewComponent,
    DashboardManualViewComponent,
  ]
})
export class InfoViewModule {
}
