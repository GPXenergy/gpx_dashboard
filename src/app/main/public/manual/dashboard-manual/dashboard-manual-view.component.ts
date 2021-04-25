import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'dashboard-manual-view',
  templateUrl: './dashboard-manual-view.component.html',
  styleUrls: ['./dashboard-manual-view.component.scss'],
})
export class DashboardManualViewComponent implements OnInit, OnDestroy {
  private readonly _unsubscribeAll = new Subject<void>();

  constructor(private titleService: Title) {
    this.titleService.setTitle('Gebruikershandleiding Dashboard | GPX');
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
