import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardLayoutComponent } from './dashboard-layout.component';

const routes: Route[] = [
  {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: 'personal-meter',
        loadChildren: () => import('./dashboard/dashboard-view/dashboard-view.module').then(m => m.DashboardViewModule),
      },
      {
        path: 'group',
        loadChildren: () => import('./dashboard/group-meter/group-meter-view.module').then(m => m.GroupMeterViewModule),
      },
      {
        path: 'configure',
        loadChildren: () => import('./dashboard/configuration/configuration-view.module').then(m => m.ConfigurationViewModule),
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  declarations: [
    DashboardLayoutComponent,
  ]
})
export class DashboardModule {
}
