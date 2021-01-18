import { Injectable } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable, ReplaySubject } from 'rxjs';

/**
 * Service that handles screen changes and helps components understand if the user is on mobile or desktop
 */
@Injectable({
  providedIn: 'root'
})
export class MobileService {
  _mobile_subject = new ReplaySubject<boolean>(1);

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe(['(max-width: 800px)']).subscribe((state: BreakpointState) => {
      this._mobile_subject.next(state.matches);
    });
  }

  public get isMobile(): Observable<boolean> {
    return this._mobile_subject.asObservable();
  }
}
