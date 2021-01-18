import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { _CONFIG } from '@gpx/services/config.service';


@NgModule()
export class GpxModule {

  constructor(@Optional() @SkipSelf() parentModule: GpxModule) {
    if (parentModule) {
      throw new Error('GpxModule is already loaded. Import it in the AppModule only!');
    }
  }

  static forRoot(config): ModuleWithProviders<GpxModule> {
    return {
      ngModule: GpxModule,
      providers: [
        {
          provide: _CONFIG,
          useValue: config
        }
      ]
    };
  }
}
