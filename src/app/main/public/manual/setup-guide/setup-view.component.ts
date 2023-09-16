import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@gpx/services/auth.service';
import { MeterSelectionService } from '@gpx/services/meter-selection.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Meter } from '@gpx/models/meter.model';
import { AuthUser } from '@gpx/models/auth-user.model';
import { Title } from '@angular/platform-browser';
import { ILEDData, IMeterMake, IMeterModel, ledData, meterGroups } from '../manual_data';


@Component({
  selector: 'gpx-setup-guide-view',
  templateUrl: './setup-view.component.html',
  styleUrls: ['./setup-view.component.scss'],
})
export class SetupViewComponent implements OnInit, OnDestroy {
  private readonly _unsubscribeAll = new Subject<void>();
  user: AuthUser;
  meters: Meter[];
  refreshDisabled = false;

  meterGroups: IMeterMake[] = meterGroups;
  ledData: ILEDData[] = ledData;

  selectedConfig: IMeterModel;


  constructor(private authService: AuthService, public meterSelectionService: MeterSelectionService,
              private titleService: Title) {
    this.titleService.setTitle('Quick-start handleiding | GPX');

    console.log(meterGroups);
  }

  ngOnInit(): void {
    this.authService.user.then(user => {
      this.user = user;
    }).catch(e => {
    });
    this.meterSelectionService.availableMeters.pipe(takeUntil(this._unsubscribeAll)).subscribe(meters => {
      this.meters = meters;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  meterSelection(e: IMeterModel): void {
    this.selectedConfig = e;
  }

  refreshMeters(): void {
    if (this.user) {
      this.refreshDisabled = true;
      this.meterSelectionService.updateMeters(this.user);
      setTimeout(() => {
        this.refreshDisabled = false;
      }, 1000);
    }
  }

  scrollTo(el: HTMLElement): void {
    if (el) {
      el.scrollIntoView({behavior: 'smooth'});
    }
  }
}
