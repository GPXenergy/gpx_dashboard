import { Component, OnDestroy, OnInit } from '@angular/core';
import { GroupMeter } from '@gpx/models/group-meter.model';
import { Subject } from 'rxjs';
import { MeterSelectionService } from '@gpx/services/meter-selection.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Meter } from '@gpx/models/meter.model';
import { GroupMeterService } from '@gpx/services/api/group-meter.service';
import { AuthService } from '@gpx/services/auth.service';
import { MobileService } from '@gpx/services/mobile.service';

@Component({
  selector: 'gpx-group-meter-view',
  templateUrl: './group-meter-view.component.html',
  styleUrls: ['./group-meter-view.component.scss'],
})
export class GroupMeterViewComponent implements OnInit, OnDestroy {
  selectedMeter: Meter;
  groupMeter: GroupMeter;
  mobileView: boolean;
  private readonly _unsubscribeAll = new Subject<void>();

  constructor(private meterSelectionService: MeterSelectionService,
              private mobileService: MobileService,
              private authService: AuthService,
              private groupMeterService: GroupMeterService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.mobileService.isMobile.pipe(takeUntil(this._unsubscribeAll)).subscribe(mobile => this.mobileView = mobile);
    this.meterSelectionService.availableMeters.pipe(takeUntil(this._unsubscribeAll)).subscribe(meters => {
      if (meters.length === 0) {
        // No meters for this user
        this.router.navigate(['configure', 'meter']);
      }
    });

    this.meterSelectionService.selectedMeter.pipe(takeUntil(this._unsubscribeAll)).subscribe(meter => {
      // Disconnect existing
      this.selectedMeter = meter;
      if (meter?.in_group) {
        this.getGroupMeterData(meter);
      } else {
        this.groupMeter = null;
      }
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getGroupMeterData(meter: Meter): void {
    this.groupMeterService.getGroupMeterDisplay(meter.getGroupParticipation().getGroup().pk).subscribe(
      group => {
        this.groupMeter = group;
      }
    );
  }


}
