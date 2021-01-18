// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { IEnvironment } from './types';

export const environment: IEnvironment = {
  production: false,
  hmr: false,
  maintenance: false,
  domains: {
    global: {
      name: 'localhost',
      secure: false
    },
    api: {
      name: 'localhost',
      port: 8000,
      secure: false
    },
    nodejs: {
      name: 'localhost',
      port: 3000,
      secure: false
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
