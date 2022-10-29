import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./authentication/auth.module').then(m => m.AuthModule)
      },
      {
        path: 'live',
        loadChildren: () => import('./public-group-meter/public-group-meter-view.module').then(m => m.PublicGroupMeterViewModule)
      },
      {
        path: 'info',
        loadChildren: () => import('./manual/info-view.module').then(m => m.InfoViewModule)
      },
      {
        path: 'setup',
        redirectTo: 'info/setup'
      },
      {
        path: 'manual',
        redirectTo: 'info'
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  declarations: [
  ]
})
export class PublicModule {
}
