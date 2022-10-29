import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { InitialLoadingIndicatorService } from './initial-loading-indicator.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'gpx-initial-loading-indicator',
  templateUrl: './initial-loading-indicator.component.html',
  styleUrls: ['./initial-loading-indicator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InitialLoadingIndicatorComponent implements OnInit, OnDestroy, AfterViewChecked {
  bufferValue: number;
  mode: string;
  value: number;
  visible: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _initialLoadingIndicatorService: InitialLoadingIndicatorService,
    private cdRef: ChangeDetectorRef
  ) {
    // Set the defaults

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }


  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the progress bar service properties

    // Buffer value
    this._initialLoadingIndicatorService.bufferValue
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((bufferValue) => {
        this.bufferValue = bufferValue;
      });

    // Mode
    this._initialLoadingIndicatorService.mode
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((mode) => {
        this.mode = mode;
      });

    // Value
    this._initialLoadingIndicatorService.value
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.value = value;
      });

    // Visible
    this._initialLoadingIndicatorService.visible
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((visible) => {
        this.visible = visible;
      });

  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

}
