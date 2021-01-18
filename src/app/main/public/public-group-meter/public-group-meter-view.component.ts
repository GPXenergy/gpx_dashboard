import { Component, OnDestroy, OnInit } from '@angular/core';
import { GroupMeter } from '@gpx/models/group-meter.model';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { GroupMeterService } from '@gpx/services/api/group-meter.service';
import { MobileService } from '@gpx/services/mobile.service';

@Component({
  selector: 'group-meter-view',
  templateUrl: './public-group-meter-view.component.html',
  styleUrls: ['./public-group-meter-view.component.scss'],
})
export class PublicGroupMeterViewComponent implements OnInit, OnDestroy {
  groupMeter: GroupMeter;
  mobileView: boolean;
  private readonly _unsubscribeAll = new Subject<void>();

  constructor(private router: Router,
              private mobileService: MobileService,
              private route: ActivatedRoute,
              private groupMeterService: GroupMeterService) {
  }

  ngOnInit(): void {
    this.mobileService.isMobile.pipe(takeUntil(this._unsubscribeAll)).subscribe(mobile => this.mobileView = mobile);
    this.route.paramMap.pipe(takeUntil(this._unsubscribeAll)).subscribe(params => {
      this.getGroupMeterData(params.get('slug'));
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getGroupMeterData(slug: string): void {
    this.groupMeterService.getGroupMeterPublicDisplay(slug).subscribe(
      group => {
        this.groupMeter = group;
      },
      error => {
        this.router.navigateByUrl('/404');
      }
    );
  }

}
