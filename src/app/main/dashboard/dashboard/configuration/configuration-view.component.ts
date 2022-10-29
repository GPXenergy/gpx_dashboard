import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

enum eTabIndex {
  ACCOUNT_TAB,
  METERS_TAB,
  GROUP_TAB,
}


@Component({
  selector: 'gpx-configuration-view',
  templateUrl: './configuration-view.component.html',
  styleUrls: ['./configuration-view.component.scss'],
})
export class ConfigurationViewComponent implements OnInit, OnDestroy {
  navLinks = [
    {
      label: 'Meter',
      link: '/configure/meter',
    }, {
      label: 'Groep',
      link: '/configure/group',
    }, {
      label: 'Account',
      link: '/configure/account',
    },
  ];
  private readonly _unsubscribeAll = new Subject<void>();

  constructor() {
  }


  ngOnInit(): void {
    // this.router..subscribe(a => console.log(a));
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
