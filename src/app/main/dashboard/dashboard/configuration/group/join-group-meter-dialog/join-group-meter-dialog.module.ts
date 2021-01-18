import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { GPXSharedModule } from '@gpx/shared.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { JoinGroupMeterDialogComponent } from './join-group-meter-dialog.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    JoinGroupMeterDialogComponent
  ],
  imports: [
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    GPXSharedModule
  ],
})
export class JoinGroupMeterDialogModule {
}
