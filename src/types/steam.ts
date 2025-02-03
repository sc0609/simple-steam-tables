export interface SteamData {
  temperature: number;
  pressure: number;
  specificVolume: {
    f: number;
    g: number;
    fg: number;
  };
  internalEnergy: {
    f: number;
    g: number;
    fg: number;
  };
  enthalpy: {
    f: number;
    g: number;
    fg: number;
  };
  entropy: {
    f: number;
    g: number;
    fg: number;
  };
  phase?: string;
}

export interface Property {
  id: string;
  title: string;
  notation: string;
  value: number | string;
  description: string;
}

export interface UnitPreferences {
  temperature: 'C' | '°C' | 'F' | 'K';
  pressure: 'MPa' | 'bar' | 'kPa' | 'psi';
  specificVolume: 'm³/kg' | 'cm³/g' | 'ft³/lb';
  energy: 'kJ/kg' | 'kcal/kg' | 'Btu/lb';
  entropy: 'kJ/(kg·K)' | 'kcal/(kg·K)' | 'Btu/(lb·°F)';
}

export interface InterpolationBounds {
  lower: SteamData;
  upper: SteamData;
  isExact?: boolean;
}

export type CalculationMode = 'temperature' | 'pressure' | 'compressed';

export interface PropertyCard {
  title: string;
  notation: string;
  value: number;
  unit: string;
  description: string;
}

export type UnitSystem = 'metric' | 'imperial';

export interface ConvertedValue {
  value: number;
  unit: string;
} 