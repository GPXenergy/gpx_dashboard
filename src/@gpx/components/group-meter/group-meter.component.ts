import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { GroupMeter, GroupParticipant } from '@gpx/models/group-meter.model';
import { Subject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { SocketService } from '@gpx/services/socket.service';
import { takeUntil } from 'rxjs/operators';
import { MobileService } from '@gpx/services/mobile.service';
import { GroupMeterInfoDialogComponent } from './group-meter-info-dialog/group-meter-info-dialog.component';
import { MediaObserver } from '@angular/flex-layout';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'group-meter',
  templateUrl: './group-meter.component.html',
  styleUrls: ['./group-meter.component.scss'],
})
export class GroupMeterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() groupMeter: GroupMeter;
  @Input() as_public: boolean;
  topRowParticipants: GroupParticipant[] = [];
  bottomRowParticipants: GroupParticipant[] = [];
  mobileView: boolean;
  // Copy public link things
  isCopied: boolean;
  timeOut = null;
  private readonly _unsubscribeAll = new Subject<void>();

  constructor(private mobileService: MobileService,
              private titleService: Title,
              private changeDetectorRef: ChangeDetectorRef,
              private socketService: SocketService,
              private media: MediaObserver,
              private dialog: MatDialog) {
  }

  get totalPower(): number {
    return this.groupMeter.total_export - this.groupMeter.total_import;
  }

  ngOnInit(): void {
    this.mobileService.isMobile.pipe(takeUntil(this._unsubscribeAll)).subscribe(mobile => this.mobileView = mobile);
    this.socketService.groupUpdates.pipe(takeUntil(this._unsubscribeAll)).subscribe(group => {
      // Apply the new group data to the local group meter
      this.groupMeter.applyUpdates(group);
      this.changeDetectorRef.detectChanges();
    });
    this.socketService.socketConnected.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
      // Resubscribe to the group meter after reconnection, only if there is a group meter object
      if (this.groupMeter) {
        this.socketService.subscribeToGroup(this.groupMeter, this.as_public);
      }
    });
  }

  ngOnDestroy(): void {
    // Disconnect the socket
    this.socketService.unsubscribeFromGroup(this.groupMeter.pk);
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.groupMeter.previousValue) {
      // Unsub from the previous group
      this.socketService.unsubscribeFromGroup(changes.groupMeter.previousValue.pk);
    }
    if (this.groupMeter) {
      this.titleService.setTitle(`Groep ${this.groupMeter.name} | GPX`);
      const participants = this.groupMeter.getParticipants();
      if (participants.length <= 2) {
        // With 2 or less, show both on top row
        this.topRowParticipants = participants;
        this.bottomRowParticipants = [];
      } else {
        // With more than 2 participant, divide over both rows
        const topCount = Math.ceil(participants.length / 2);
        this.topRowParticipants = participants.slice(0, topCount);
        this.bottomRowParticipants = participants.slice(topCount, participants.length);
      }
      // Subscribe to the group real time updates
      this.socketService.subscribeToGroup(this.groupMeter, this.as_public);
    }
  }

  openGroupDetail(): void {
    const dialogRef = this.dialog.open(GroupMeterInfoDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: this.media.isActive('xs') ? '90vh' : '600px',
      autoFocus: false,
      panelClass: 'dialog-no-padding',
      data: this.groupMeter,
      closeOnNavigation: false
    });
    dialogRef.afterClosed().pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {

    });
  }

  copyPublicLink(): void {
    this.isCopied = true;
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      this.isCopied = false;
    }, 1000);
  }
}
