interface ConversionFactors {
  [key: string]: number;
}

const pressureConversions: ConversionFactors = {
  'MPa_to_bar': 10,
  'MPa_to_kPa': 1000,
  'MPa_to_psi': 145.038,
  'bar_to_MPa': 0.1,
  'bar_to_kPa': 100,
  'bar_to_psi': 14.5038,
  'kPa_to_MPa': 0.001,
  'kPa_to_bar': 0.01,
  'kPa_to_psi': 0.145038,
  'psi_to_MPa': 0.00689476,
  'psi_to_bar': 0.0689476,
  'psi_to_kPa': 6.89476
};

export const unitConversions = {
  pressure: pressureConversions,
  specificVolume: {
    'm³/kg_to_cm³/g': 1000000,
    'm³/kg_to_ft³/lb': 16.0185,
    'cm³/g_to_m³/kg': 0.000001,
    'cm³/g_to_ft³/lb': 0.0000160185,
    'ft³/lb_to_m³/kg': 0.062428,
    'ft³/lb_to_cm³/g': 62.428
  },
  energy: {
    'kJ/kg_to_kcal/kg': 0.239006,
    'kJ/kg_to_BTU/lb': 0.429923,
    'kcal/kg_to_kJ/kg': 4.184,
    'kcal/kg_to_BTU/lb': 1.8,
    'BTU/lb_to_kJ/kg': 2.326,
    'BTU/lb_to_kcal/kg': 0.556
  },
  entropy: {
    'kJ/(kg·K)_to_kcal/(kg·K)': 0.239006,
    'kJ/(kg·K)_to_BTU/(lb·°F)': 0.239006,
    'kcal/(kg·K)_to_kJ/(kg·K)': 4.184,
    'kcal/(kg·K)_to_BTU/(lb·°F)': 1,
    'BTU/(lb·°F)_to_kJ/(kg·K)': 4.184,
    'BTU/(lb·°F)_to_kcal/(kg·K)': 1
  }
};

export function convertValue(value: number, fromUnit: string, toUnit: string): number {
  if (fromUnit === toUnit) return value;
  
  const conversionKey = `${fromUnit}_to_${toUnit}`;
  const conversionFactor = Object.values(unitConversions).reduce((factor, conversions) => {
    return factor || conversions[conversionKey];
  }, 0);

  if (!conversionFactor) {
    console.error(`No conversion found for ${fromUnit} to ${toUnit}`);
    return value;
  }

  return value * conversionFactor;
} 