import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';


@Component({
  selector: 'footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent implements OnInit, OnDestroy {

  private readonly onDestroy: Subject<void> = new Subject<void>();

  constructor() {

  }

  ngOnInit(): void {
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}
