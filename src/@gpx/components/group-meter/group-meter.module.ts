import { NgModule } from '@angular/core';
import { GroupMeterComponent } from './group-meter.component';
import { GPXSharedModule } from '@gpx/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { GroupMeterParticipantComponent } from './group-meter-participant/group-meter-participant.component';
import { GroupMeterCardComponent } from './group-meter-participant/group-meter-card/group-meter-card.component';
import { EnergyPathComponent } from './group-meter-participant/energy-path/energy-path.component';
import { EnergyNetPathComponent } from './energy-net-path/energy-net-path.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatInputModule } from '@angular/material/input';
import { GroupMeterParticipantDialogModule } from './group-meter-participant/group-meter-participant-dialog/group-meter-participant-dialog.module';
import { GroupMeterInfoDialogModule } from './group-meter-info-dialog/group-meter-info-dialog.module';

@NgModule({
  imports: [
    GPXSharedModule,
    MatCardModule,
    MatProgressBarModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    ClipboardModule,
    GroupMeterParticipantDialogModule,
    GroupMeterInfoDialogModule,
  ],
  declarations: [
    GroupMeterComponent,
    GroupMeterParticipantComponent,
    GroupMeterCardComponent,
    EnergyPathComponent,
    EnergyNetPathComponent
  ],
  exports: [
    GroupMeterComponent,
  ]
})
export class GroupMeterModule {
}
