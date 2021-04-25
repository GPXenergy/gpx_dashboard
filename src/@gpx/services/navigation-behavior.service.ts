import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';

/**
 * Service that handles the sidebar navigation
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationBehaviorService {

  private sideNavigation: MatSidenav;
  private sideNavMobileState: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe(['(max-width: 1279px)']).subscribe((state: BreakpointState) => {
      this.sideNavMobileState.next(state.matches);
      if (state.matches && this.sideNavigation) {
        this.sideNavigation.close();
      }
    });
  }

  public get mobileSideNav(): BehaviorSubject<boolean> {
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

}
