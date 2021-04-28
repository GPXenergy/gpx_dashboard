import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardViewComponent } from './dashboard-view.component';
import { MatCardModule } from '@angular/material/card';
import { GPXSharedModule } from '@gpx/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardGraphComponent } from './dashboard-graph/dashboard-graph.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';


const routes: Route[] = [
  {
    path: '',
    component: DashboardViewComponent
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    NgxChartsModule,
    GPXSharedModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatMenuModule,
    MatTabsModule,
  ],
  declarations: [
    DashboardViewComponent,
    DashboardGraphComponent,
  ]
})
export class DashboardViewModule {
}
