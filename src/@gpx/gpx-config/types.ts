export interface Config {
  colorTheme?: string;
  layout: {
    navbar: {
      hidden: boolean,
      folded: boolean,
    },
    toolbar: {
      hidden: boolean,
      position: 'above' | 'above-static' | 'above-fixed' | 'below' | 'below-static' | 'below-fixed'
    }
    footer: {
      hidden: boolean,
      hiddenMobile: boolean
    },
  };
}
