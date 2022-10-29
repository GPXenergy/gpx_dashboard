import { Component, Input } from '@angular/core';

@Component({
  selector: 'gpx-energy-net-path',
  templateUrl: 'energy-net-path.component.html',
  styleUrls: ['./energy-net-path.component.scss'],
})
export class EnergyNetPathComponent {
  @Input() orientation: 'horizontal' | 'vertical';
  @Input() reverse: boolean;
}

