import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@gpx/services/auth.service';
import { MeterSelectionService } from '@gpx/services/meter-selection.service';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'gpx-setup-guide-view',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit, OnDestroy {
  private readonly _unsubscribeAll = new Subject<void>();

  view: 'dashboard' | 'gpxconnector' | 'data' | 'other';

  constructor(private route: ActivatedRoute, private titleService: Title) {
    this.titleService.setTitle('Veelgestelde vragen | GPX');

  }

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this._unsubscribeAll)).subscribe(params => {
      this.view = params.questions || null;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  scrollTo(el: HTMLElement): void {
    if (el) {
      el.scrollIntoView({behavior: 'smooth'});
    }
  }
}
