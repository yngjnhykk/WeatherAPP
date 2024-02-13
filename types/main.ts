export interface localTpe {
  latitude: number;
  longitude: number;
}

export interface locationType {
  city: string | null;
  country: string | null;
  district: string | null;
  isoCountryCode: string | null;
  name: string | null;
  postalCode: string | null;
  region: string | null;
  street: string | null;
  streetNumber: string | null;
  subregion: string | null;
  timezone: string | null;
}

export interface weatherCondition {
  icon: string | undefined;
  gradient: string[];
}
export interface weatherConditions {
  [Clouds: string]: weatherCondition;
  Clear: weatherCondition;
  Atmosphere: weatherCondition;
  Snow: weatherCondition;
  Rain: weatherCondition;
  Drizzle: weatherCondition;
  Thunderstorm: weatherCondition;
}
