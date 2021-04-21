import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from './config.service';

/**
 * Service that handles the sidebar navigation
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationBehaviorService {

  sideNavigation: MatSidenav;
  public userClicked: boolean;
  private sideNavMobileState: BehaviorSubject<boolean> = new BehaviorSubject(null);
  private mobileState: boolean;

  constructor(private breakpointObserver: BreakpointObserver,
              private configService: ConfigService,
              private router: Router) {
    this.breakpointObserver
      .observe(['(max-width: 1279px)'])
      .subscribe((state: BreakpointState) => {
        this.mobileState = state.matches;
        this.sideNavMobileState.next(this.mobileState);
        if (state.matches && this.sideNavigation) {
          this.sideNavigation.close();
          return this.sideNavigation.mode = 'over';
        } else if (!state.matches && this.sideNavigation) {
          this.sideNavigation.mode = 'side';
        }

        if (!this.configService.gxpconfig.layout.navbar.hidden) {
          this.sideNavigation.open();
        }
        // if (state.matches) {
        //   this.sideNavMobileState.next(this.mobileState);
        // }
      });

    this.router.events.pipe(
      filter(event => event instanceof NavigationStart))
      .subscribe(event => {
        if (!this.userClicked) {
          this.resetSideNavState();
        }
      });
  }

  public get listenToMobileSideNavState(): BehaviorSubject<boolean> {
    return this.sideNavMobileState;
  }

  /*
  Only to be used by page-layout component
  */
  setSideNavigation(sideNav: MatSidenav): void {
    this.sideNavigation = sideNav;
  }

  toggleSideNav(): void {
    this.sideNavigation.toggle();
  }

  openSideNav(): void {
    this.sideNavigation.open();
  }

  closeSideNav(): void {
    this.sideNavigation.close();
  }

  private resetSideNavState(): void {

  }

}
