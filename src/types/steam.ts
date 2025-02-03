export interface SteamData {
  temperature: number;
  pressure: number;
  specificVolume: number | { f: number; g: number; fg: number };
  internalEnergy: number | { f: number; g: number; fg: number };
  enthalpy: number | { f: number; g: number; fg: number };
  entropy: number | { f: number; g: number; fg: number };
  phase?: string;
}

export interface PropertySet {
  f: number;  // Saturated liquid
  g: number;  // Saturated vapor
  fg: number; // Vaporization
}

export type UnitPreferences = {
  temperature: 'C';
  pressure: 'MPa' | 'bar' | 'kPa' | 'psi';
  specificVolume: 'm³/kg' | 'cm³/g' | 'ft³/lb';
  energy: 'kJ/kg' | 'kcal/kg' | 'BTU/lb';
  entropy: 'kJ/(kg·K)' | 'kcal/(kg·K)' | 'BTU/(lb·°F)';
};

export type CalculationMode = 'temperature' | 'pressure';

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