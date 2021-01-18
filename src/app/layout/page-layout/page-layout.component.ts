import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { filter, takeUntil } from 'rxjs/operators';
import { NavigationBehaviorService } from '@gpx/services/navigation-behavior.service';
import { ConfigService } from '@gpx/services/config.service';
import { Config } from '@gpx/gpx-config/types';
import { Meter } from '@gpx/models/meter.model';
import { MeterSelectionService } from '@gpx/services/meter-selection.service';
import { User } from '@gpx/models/user.model';
import { AuthService } from '@gpx/services/auth.service';


@Component({
  selector: 'gpx-layout',
  templateUrl: './page-layout.component.html',
  styleUrls: ['./page-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PageLayoutComponent implements OnInit, OnDestroy {

  @ViewChild('snav', {static: true}) sidenav: MatSidenav;
  config: Config;
  // @ViewChild(PerfectScrollbarDirective, { static: false }) directiveRef?: PerfectScrollbarDirective;
  isMobileState: boolean;
  user: User;
  availableMeters: Meter[];
  selectedMeter: Meter;
  private readonly _unsubscribeAll = new Subject<void>();

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private authService: AuthService,
              private navigationBehaviorService: NavigationBehaviorService,
              private configService: ConfigService,
              private meterSelectionService: MeterSelectionService,
              private router: Router) {

    this.navigationBehaviorService.listenToMobileSideNavState.pipe(
      takeUntil(this._unsubscribeAll)
    ).subscribe((mobileState: boolean) => {
      this.isMobileState = mobileState;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this._unsubscribeAll)
    ).subscribe(() => {
      if (this.isMobileState) {
        this.sidenav.close();
      }
    });

    // Subscribe to config changes
    this.configService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe((config) => {
      this.config = config;
      // this.document.body.classList.add(this.oanaxConfig.colorTheme);
      if (this.config.layout.navbar.hidden) {
        this.sidenav?.close();
      } else if (!this.isMobileState) {
        this.sidenav?.open();
      }
    });
  }


  ngOnInit(): void {
    this.setUpSideNav();
    this.navigationBehaviorService.setSideNavigation(this.sidenav);

    this.authService.userUpdated.pipe(takeUntil(this._unsubscribeAll)).subscribe(user => {
      this.user = user;
      this.changeDetectorRef.detectChanges();
    });

    this.meterSelectionService.availableMeters.pipe(takeUntil(this._unsubscribeAll)).subscribe(meters => {
      this.availableMeters = meters;
      this.changeDetectorRef.detectChanges();
    });

    this.meterSelectionService.selectedMeter.pipe(takeUntil(this._unsubscribeAll)).subscribe(meter => {
      this.selectedMeter = meter;
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  setUpSideNav(): void {
    if (this.config.layout.navbar.hidden) {
      this.sidenav.close();
    } else {
      if (!this.isMobileState) {
        this.sidenav.open();
      }
    }
  }

  selectMeter(meter: Meter): void {
    if (meter.pk !== this.selectedMeter.pk) {
      this.meterSelectionService.setMeter(meter.pk);
    }
  }
}
