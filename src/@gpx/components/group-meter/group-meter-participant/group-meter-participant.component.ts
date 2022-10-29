import { Component, Input } from '@angular/core';
import { GroupMeter, GroupParticipant } from '@gpx/models/group-meter.model';
import { AnimationSpeed } from './energy-path/energy-path.component';


@Component({
  selector: 'gpx-group-meter-participant',
  templateUrl: './group-meter-participant.component.html',
  styleUrls: ['./group-meter-participant.component.scss']
})
export class GroupMeterParticipantComponent {

  @Input() data: GroupParticipant;
  @Input() group: GroupMeter;
  @Input() connection: 'top' | 'bottom' | 'side';

  constructor() {
  }

  get animationSpeed(): AnimationSpeed {
    const power = Math.abs(this.data?.actual_power);
    if (power === 0) {
      return AnimationSpeed.NONE;
    } else if (power > 4) {
      return AnimationSpeed.QUICK;
    } else if (power > 2) {
      return AnimationSpeed.MEDIUM;
    } else {
      return AnimationSpeed.SLOW;
    }
  }
}
