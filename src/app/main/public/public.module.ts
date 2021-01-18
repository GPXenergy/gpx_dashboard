import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PublicLayoutComponent } from './public-layout.component';

const routes: Route[] = [
  {
    path: '',
    component: PublicLayoutComponent,
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
        path: 'manual',
        loadChildren: () => import('./manual/manual-view.module').then(m => m.ManualViewModule)
      },
      {
        path: 'setup',
        redirectTo: 'manual'
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  declarations: [
    PublicLayoutComponent,
  ]
})
export class PublicModule {
}
