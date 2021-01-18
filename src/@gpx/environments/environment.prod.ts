import { IEnvironment } from './types';

export const environment: IEnvironment = {
  production: true,
  hmr: false,
  maintenance: false,
  domains: {
    global: {
      name: 'dashboard.gpx.nl',
      secure: true
    },
    api: {
      name: 'dashboard.gpx.nl',
      secure: true
    },
    nodejs: {
      name: 'dashboard.gpx.nl',
      port: 3000,
      secure: true
    },
  }
};
