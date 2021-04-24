import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@gpx/services/auth.service';
import { MeterSelectionService } from '@gpx/services/meter-selection.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Meter } from '@gpx/models/meter.model';
import { AuthUser } from '@gpx/models/auth-user.model';


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
  selector: 'setup-guide-view',
  templateUrl: './setup-view.component.html',
  styleUrls: ['./setup-view.component.scss'],
})
export class SetupViewComponent implements OnInit, OnDestroy {
  private readonly _unsubscribeAll = new Subject<void>();
  user: AuthUser;
  meters: Meter[];
  refreshDisabled = false;

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
  },];

  selectedConfig: {
    baud: 9600 | 115200;
    parity: '7E1' | '8N1';
  };


  constructor(private authService: AuthService, public meterSelectionService: MeterSelectionService) {

  }

  ngOnInit(): void {
    this.authService.user.then(user => {
      this.user = user;
    }).catch(e => {
    });
    this.meterSelectionService.availableMeters.pipe(takeUntil(this._unsubscribeAll)).subscribe(meters => {
      this.meters = meters;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  meterSelection(e): void {
    this.selectedConfig = e.value;
  }

  refreshMeters(): void {
    if (this.user) {
      this.refreshDisabled = true;
      this.meterSelectionService.updateMeters(this.user);
      setTimeout(() => {
        this.refreshDisabled = false;
      }, 1000);
    }
  }

}
