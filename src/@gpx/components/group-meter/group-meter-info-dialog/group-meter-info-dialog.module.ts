import {NgModule} from '@angular/core';
import { GroupMeterInfoDialogComponent } from './group-meter-info-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GPXSharedModule } from '@gpx/shared.module';


@NgModule({
  declarations: [
    GroupMeterInfoDialogComponent,
  ],
  imports: [
    GPXSharedModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSidenavModule,
    MatMenuModule,
  ],
})
export class GroupMeterInfoDialogModule { }
