import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterCompleteComponent } from './register/register-complete/register-complete.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthPageComponent } from './auth-page.component';
import { GPXSharedModule } from '@gpx/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './forgot-password/reset-password/reset-password.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


const routes = [
  {
    path: '',
    component: AuthPageComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'register',
        children: [
          {
            path: '',
            component: RegisterComponent,
            children: [
              {
                path: 'complete',
              }
            ]
          },

        ]
      },
      {
        path: 'forgot-password',
        children: [
          {
            path: '',
            component: ForgotPasswordComponent,
          },
          {
            path: 'reset',
            component: ResetPasswordComponent
          },
        ]
      }
    ]
  },
  {
    path: 'logout',
    component: LogoutComponent
  },
];

@NgModule({
  declarations: [
    AuthPageComponent,
    RegisterComponent,
    LoginComponent,
    LogoutComponent,
    RegisterCompleteComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    GPXSharedModule,
    MatDividerModule,
    RouterModule.forChild(routes),
    MatProgressSpinnerModule,
  ]
})
export class AuthModule {
}
