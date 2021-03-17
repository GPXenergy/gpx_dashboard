import {NgModule} from '@angular/core';
import {ChangePasswordComponent} from './change-password.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { GPXSharedModule } from '@gpx/shared.module';


@NgModule({
  declarations: [
    ChangePasswordComponent,
  ],
  exports: [
    ChangePasswordComponent
  ],
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    GPXSharedModule,
  ],
})
export class ChangePasswordModule {
}
