import { Component, Input, OnInit } from '@angular/core';
import { GroupParticipant, ParticipantConnection } from '@gpx/models/group-meter.model';

@Component({
  selector: 'app-group-meter-card',
  templateUrl: './group-meter-card.component.html',
  styleUrls: ['./group-meter-card.component.scss']
})
export class GroupMeterCardComponent implements OnInit {

  @Input() data: GroupParticipant;

  constructor() {
  }

  ngOnInit(): void {
  }

  statusIcon(): string {
    switch (this.data.lastActivity) {
      case ParticipantConnection.ACTIVE:
        return 'signal_cellular_4_bar';
      case ParticipantConnection.INACTIVE:
        return 'signal_cellular_connected_no_internet_4_bar';
      case ParticipantConnection.OFFLINE:
        return 'signal_cellular_off';
    }
  }

  statusText(): string {
    switch (this.data.lastActivity) {
      case ParticipantConnection.ACTIVE:
        return 'Live';
      case ParticipantConnection.INACTIVE:
        return 'Inactief';
      case ParticipantConnection.OFFLINE:
        return 'Offline';
    }
  }

}
