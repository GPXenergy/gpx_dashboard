import { Component, Input } from '@angular/core';

export enum AnimationSpeed {
  NONE = 'none',
  SLOW = 'slow',
  MEDIUM = 'medium',
  QUICK = 'quick',
}

@Component({
  selector: 'app-energy-path',
  templateUrl: 'energy-path.component.html',
  styleUrls: ['./energy-path.component.scss'],
})
export class EnergyPathComponent {
  @Input() speed: AnimationSpeed;
  @Input() orientation: 'horizontal' | 'vertical';
  @Input() direction: 'lr' | 'rl' | 'tb' | 'bt';
  @Input() reverse: boolean;
}
