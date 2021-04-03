import {NgModule} from '@angular/core';
import { GroupMeterParticipantDialogComponent } from './group-meter-participant-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { GPXSharedModule } from '@gpx/shared.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    GroupMeterParticipantDialogComponent,
  ],
  imports: [
    GPXSharedModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSidenavModule,
    MatMenuModule,
    MatTabsModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
})
export class GroupMeterParticipantDialogModule { }
