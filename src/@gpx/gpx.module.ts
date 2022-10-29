import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';


@NgModule()
export class GpxModule {

  constructor(@Optional() @SkipSelf() parentModule: GpxModule) {
    if (parentModule) {
      throw new Error('GpxModule is already loaded. Import it in the AppModule only!');
    }
  }
}
