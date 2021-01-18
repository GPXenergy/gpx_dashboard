import { Component, HostBinding } from '@angular/core';
import { CONFIGS } from '@gpx/gpx-config';
import { ConfigService } from '@gpx/services/config.service';

@Component({
  selector: 'dashboard-content',
  template: '<router-outlet></router-outlet>',
})
export class DashboardLayoutComponent {
  @HostBinding('class') layoutClass = 'layout-container';

  constructor(private config: ConfigService) {
    this.config.setConfig(CONFIGS.dashboard);
  }
}
