import { Config } from '@gpx/gpx-config/types';

interface IConfigs {
  dashboard: Config;
  public: Config;
}

export const CONFIGS: IConfigs = {
  dashboard: {
    layout: {
      navbar: {
        folded: false,
        hidden: false,
      },
      toolbar: {
        hidden: false,
        position: 'above',
      },
      footer: {
        hidden: false,
        hiddenMobile: false
      },
    },
  },
  public: {
    layout: {
      navbar: {
        folded: false,
        hidden: false,
      },
      toolbar: {
        hidden: false,
        position: 'above'
      },
      footer: {
        hidden: true,
        hiddenMobile: false
      },
    },
  },
};

