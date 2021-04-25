import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MeterSelectionService } from '../../../../../@gpx/services/meter-selection.service';
import { Title } from '@angular/platform-browser';


interface MeterModel {
  value: {
    baud: 9600 | 115200;
    parity: '7E1' | '8N1';
  };
  model: string;
}

interface MeterMake {
  disabled?: boolean;
  name: string;
  meters: MeterModel[];
}

interface LEDData {
  color: string;
  blink: string;
  description: string;
}


@Component({
  selector: 'gpxc-manual-view',
  templateUrl: './gpx-connector-manual-view.component.html',
  styleUrls: ['./gpx-connector-manual-view.component.scss'],
})
export class GpxConnectorManualViewComponent implements OnInit, OnDestroy {
  private readonly _unsubscribeAll = new Subject<void>();

  meterGroups: MeterMake[] = [
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

  ledData: LEDData[] = [{
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
  }];

  constructor(private titleService: Title) {
    this.titleService.setTitle('Gebruikershandleiding GPXconnector | GPX');
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
