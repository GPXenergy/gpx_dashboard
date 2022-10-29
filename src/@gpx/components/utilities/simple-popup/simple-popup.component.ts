import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, filter, share, startWith, switchMap, switchMapTo, takeUntil } from 'rxjs/operators';

/**
 * How to use:
 * example
 *  <mat-icon cdkOverlayOrigin #overlayOrigin="cdkOverlayOrigin">info</mat-icon>
 *  <simple-popup [noStyle]="true" [overlayOrigin]="overlayOrigin" [maxWidth]="300">
      !!custom component or text here (cards etc can also be added)
    </simple-popup>
 */

@Component({
  selector: 'gpx-simple-popup',
  templateUrl: './simple-popup.component.html',
  styleUrls: ['./simple-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class PopupComponent implements OnDestroy, OnInit {

  @Input() overlayOrigin: CdkOverlayOrigin;

  @Input() noStyle: boolean;
  @Input() maxWidth: number;
  @Input() disableDebounceTime: boolean;

  @Output() close = new EventEmitter<any>();
  @Output() open = new EventEmitter<any>();

  @ViewChild('dialog') dialog: ElementRef;
  isOpened = false;
  destroy$ = new Subject<any>();

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    const overlayOriginEl = this.overlayOrigin.elementRef.nativeElement;


    // open popup if mouse stopped in overlayOriginEl (for short time).
    // If user just quickly got over overlayOriginEl element - do not open
    const open$ = fromEvent(overlayOriginEl, 'mouseenter').pipe(
      filter(() => !this.isOpened),
      switchMap(enterEvent =>
        fromEvent(document, 'mousemove').pipe(
          startWith(enterEvent),
          debounceTime(this.disableDebounceTime ? 50 : 300),
          filter(event => overlayOriginEl === event['target']),
        )
      ),
      share(),
      takeUntil(this.destroy$)
    );

    open$.subscribe(() => this.changeState(true));

    // close if mouse left the overlayOriginEl and dialog(after short delay)
    const close$ = fromEvent(document, 'mousemove').pipe(
      debounceTime(this.disableDebounceTime ? 40 : 100),
      filter(() => this.isOpened),
      filter(event => this.isMovedOutside(overlayOriginEl, this.dialog, event))
    );


    open$.pipe(
      takeUntil(this.destroy$),
      switchMapTo(close$)
    ).subscribe(() => {
      this.changeState(false);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  connectedOverlayDetach(): void {
    this.changeState(false);
  }

  private changeState(isOpened: boolean): void {
    this.isOpened = isOpened;
    isOpened ? this.open.emit() : this.close.emit();
    this.changeDetectorRef.markForCheck();
  }

  private isMovedOutside(overlayOriginEl, dialog, event): boolean {
    return !(overlayOriginEl.contains(event['target']) || dialog.nativeElement.contains(event['target']));
  }
}
