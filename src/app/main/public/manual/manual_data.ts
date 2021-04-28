

export interface IMeterModel {
  value: {
    baud: 9600 | 115200;
    parity: '7E1' | '8N1';
  };
  model: string;
}

export interface IMeterMake {
  disabled?: boolean;
  name: string;
  meters: IMeterModel[];
}

export interface ILEDData {
  color: string;
  blink: string;
  description: string;
}

export interface IConnectorComponents {
  [key: string]: {
    name: string;
    image: string;
    components: {
      ref: string,
      name: string,
      description: string,
    }[];
  };
}


export const meterGroups: IMeterMake[] = [
  {
    name: 'Iskra',
    meters: [{
      value: {baud: 9600, parity: '7E1'},
      model: 'ME 382',
    }, {
      value: {baud: 9600, parity: '7E1'},
      model: 'MT 382',
    }, {
      value: {baud: 115200, parity: '8N1'},
      model: 'AM 550',
    }]
  },
  {
    name: 'Kaifa',
    meters: [{
      value: {baud: 115200, parity: '8N1'},
      model: 'E0003',
    }, {
      value: {baud: 115200, parity: '8N1'},
      model: 'E0025',
    }, {
      value: {baud: 115200, parity: '8N1'},
      model: 'MA105',
    }, {
      value: {baud: 115200, parity: '8N1'},
      model: 'MA105C',
    }, {
      value: {baud: 115200, parity: '8N1'},
      model: 'MA304',
    }, {
      value: {baud: 115200, parity: '8N1'},
      model: 'MA304C',
    }]
  },
  {
    name: 'Kamstrup',
    disabled: true,
    meters: [{
      value: {baud: 9600, parity: '7E1'},
      model: '162',
    }, {
      value: {baud: 9600, parity: '7E1'},
      model: '351',
    }, {
      value: {baud: 9600, parity: '7E1'},
      model: '382',
    }]
  },
  {
    name: 'Landis + Gyr',
    meters: [{
      value: {baud: 115200, parity: '8N1'},
      model: 'E350 (ZCF100) (DSMR 4.0)',
    }, {
      value: {baud: 115200, parity: '7E1'},
      model: 'E350 (ZCF100) (DSMR 4.2)',
    }, {
      value: {baud: 115200, parity: '8N1'},
      model: 'E350 (ZCF110)',
    }, {
      value: {baud: 115200, parity: '8N1'},
      model: 'E350 (ZFF100)',
    }, {
      value: {baud: 115200, parity: '8N1'},
      model: 'E350 (ZMF100)',
    }, {
      value: {baud: 115200, parity: '8N1'},
      model: 'E360 (T11142)',
    }]
  },
  {
    name: 'Sagemcom',
    meters: [{
      value: {baud: 115200, parity: '8N1'},
      model: 'T210-D ESMR5',
    }]
  }
];

export const ledData: ILEDData[] = [
  {
    color: 'Groen + Blauw',
    blink: 'Geen',
    description: 'GPXconnector is in configuratiemodus',
  }, {
    color: 'Blauw',
    blink: 'Kort per 2 seconden',
    description: 'GPXconnector wordt geupdate',
  }, {
    color: 'Wit (alle kleuren)',
    blink: 'Kort per 4 seconden',
    description: 'Idle - wacht op data van meter',
  }, {
    color: 'Groen',
    blink: 'Eens per seconde',
    description: 'Data wordt succesvol verzonden naar de server!',
  }, {
    color: 'Rood',
    blink: 'Geen',
    description: 'Kan geen verbinding maken met de WiFi',
  }, {
    color: 'Rood',
    blink: '2x per seconde',
    description: 'Fout in de uitgelezen data',
  }, {
    color: 'Paars',
    blink: 'Geen',
    description: 'Verkeerde API key ingesteld',
  }, {
    color: 'Paars',
    blink: 'Per 2 seconden',
    description: 'Fout in de data richting de API',
  }, {
    color: 'Paars',
    blink: 'Kort per 4 seconden',
    description: 'Server is niet bereikbaar vanuit jouw netwerk',
  }
];

export const connectorComponents: IConnectorComponents = {
  v1: {
    name: 'Prototype 1.0',
    image: '/assets/manual/gpx-connector-v1.png',
    components: [
      {ref: 'A', name: 'Status LED', description: 'Deze 3-kleuren LED duidt de toestand van het systeem aan'},
      {ref: 'B', name: 'Modus-schakelaar', description: 'Schakelaar om tussen actieve en configuratiemodus te wisselen'},
      {ref: 'C', name: 'ZonPV input', description: 'Aansluiting voor stroomtang die de stroom van de omvormer opneemt'},
      {ref: 'D', name: 'Slimme meter input', description: 'Aansluiting voor de slimme meter via een RJ12 kabel'},
      {ref: 'E', name: 'Micro-USB voeding', description: 'Voeding voor de GPXconnector'},
      {ref: 'F', name: 'Voedingsbron-schakelaar', description: 'Wisselt tussen voeding van micro-USB of vanuit de slimme meter'},
    ]
  }
  // v2 can have different image and components
};
