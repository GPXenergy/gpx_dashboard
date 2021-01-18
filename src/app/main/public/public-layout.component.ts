import { Component, HostBinding } from '@angular/core';
import { ConfigService } from '@gpx/services/config.service';
import { CONFIGS } from '@gpx/gpx-config';


@Component({
  selector: 'public-content',
  template: '<router-outlet></router-outlet>',
})
export class PublicLayoutComponent {
  @HostBinding('class') layoutClass = 'layout-container';

  constructor(private config: ConfigService) {
    this.config.setConfig(CONFIGS.public);
  }
}
