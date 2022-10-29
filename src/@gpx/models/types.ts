

export enum EMeterType {
  CONSUMER = 'consumer',
  PROSUMER = 'prosumer',
  BATTERY = 'battery',
  PRODUCER_SOLAR = 'producer_solar',
  PRODUCER_WIND = 'producer_wind',
  PRODUCER_OTHER = 'producer_other',
}

export enum EResidenceType {
  UNDEFINED = 'undefined',
  APARTMENT = 'apartment',
  CORNER_HOUSE = 'corner_house',
  TERRACED_HOUSE = 'terraced_house',
  TWO_ONE_ROOF = 'two_one_roof',
  DETACHED_HOUSE = 'detached_house',
  GROUND_FLOOR_APARTMENT = 'ground_floor_apartment',
  UPSTAIRS_APARTMENT = 'upstairs_apartment',
}

export enum EResidenceEnergyLabel {
  UNDEFINED = 'undefined',
  APPPP = 'apppp',
  APPP = 'appp',
  APP = 'app',
  AP = 'ap',
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
  E = 'e',
  F = 'f',
  G = 'g',
}

export enum EMeterVisibility {
  PRIVATE = 'private',
  GROUP = 'group',
  PUBLIC = 'public',
}
