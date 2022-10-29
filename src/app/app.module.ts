import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';

import { LayoutModule } from './layout/layout.module';
import { InitialLoadingIndicatorModule } from '@gpx/components/utilities/initial-loading-indicator/initial-loading-indicator.module';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { LandingComponent } from './main/landing.component';
import { NotFoundComponent } from './main/error-pages/not-found/not-found.component';
import { LoginRequiredChildrenGuard } from '@gpx/guards/auth-route.guard';
import { ApiInterceptor } from '@gpx/services/api.intercepter';
import { GPXSharedModule } from '@gpx/shared.module';
import { CustomDateAdapter } from '../@gpx/adapters/date.adapter';
import { GpxModule } from '../@gpx/gpx.module';

registerLocaleData(localeNl, 'nl');


export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LandingComponent
  },
  {
    path: '',
    loadChildren: () => import('./main/public/public.module').then(m => m.PublicModule),
  },
  {
    path: '',
    canActivateChild: [LoginRequiredChildrenGuard],
    loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    // Oanax
    GPXSharedModule,
    LayoutModule,
    InitialLoadingIndicatorModule,
    TranslateModule.forRoot(),
    GpxModule,
    MatNativeDateModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true
    },
    {provide: LOCALE_ID, useValue: 'nl-NL'},
    {provide: MAT_DATE_LOCALE, useValue: 'nl-NL'},
    {provide: DateAdapter, useClass: CustomDateAdapter}

  ],

  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
