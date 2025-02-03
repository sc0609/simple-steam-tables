import { SteamData } from '../types/steam';
import steamData from '../data/saturated_by_temperature_V1.5.json';

export class SteamDataLoader {
  private static tempMap = new Map<number, SteamData>();
  private static temperatures: number[] = [];

  static initialize() {
    // Store temperatures in sorted array for easier lookup
    this.temperatures = steamData.data.map(([temp]) => temp).sort((a, b) => a - b);
    
    steamData.data.forEach(([temp, p, vf, vg, uf, ug, ufg, hf, hg, hfg, sf, sg, sfg]) => {
      this.tempMap.set(temp, {
        temperature: temp,
        pressure: p,
        specificVolume: {
          f: vf,
          g: vg,
          fg: vg - vf
        },
        internalEnergy: {
          f: uf,
          g: ug,
          fg: ufg
        },
        enthalpy: {
          f: hf,
          g: hg,
          fg: hfg
        },
        entropy: {
          f: sf,
          g: sg,
          fg: sfg
        }
      });
    });
  }

  static getInterpolatedData(temp: number): InterpolatedResult | null {
    // First check if the exact temperature exists in the dataset
    if (this.tempMap.has(temp)) {
      const data = this.tempMap.get(temp)!;
      return {
        data,
        bounds: {
          lower: data,
          upper: data,
          isExact: true
        }
      };
    }

    // Find the nearest integer temperatures for interpolation
    const lowerTemp = Math.floor(temp);
    const upperTemp = Math.ceil(temp);

    // Get the data for these temperatures
    const data1 = this.tempMap.get(lowerTemp);
    const data2 = this.tempMap.get(upperTemp);

    if (!data1 || !data2) return null;

    // Linear interpolation
    const fraction = (temp - lowerTemp) / (upperTemp - lowerTemp);

    const interpolatedData = {
      temperature: temp,
      pressure: this.interpolateValue(data1.pressure, data2.pressure, lowerTemp, upperTemp, temp),
      specificVolume: {
        f: this.interpolateValue(data1.specificVolume.f, data2.specificVolume.f, lowerTemp, upperTemp, temp),
        g: this.interpolateValue(data1.specificVolume.g, data2.specificVolume.g, lowerTemp, upperTemp, temp),
        fg: this.interpolateValue(data1.specificVolume.fg, data2.specificVolume.fg, lowerTemp, upperTemp, temp)
      },
      internalEnergy: {
        f: this.interpolateValue(data1.internalEnergy.f, data2.internalEnergy.f, lowerTemp, upperTemp, temp),
        g: this.interpolateValue(data1.internalEnergy.g, data2.internalEnergy.g, lowerTemp, upperTemp, temp),
        fg: this.interpolateValue(data1.internalEnergy.fg, data2.internalEnergy.fg, lowerTemp, upperTemp, temp)
      },
      enthalpy: {
        f: this.interpolateValue(data1.enthalpy.f, data2.enthalpy.f, lowerTemp, upperTemp, temp),
        g: this.interpolateValue(data1.enthalpy.g, data2.enthalpy.g, lowerTemp, upperTemp, temp),
        fg: this.interpolateValue(data1.enthalpy.fg, data2.enthalpy.fg, lowerTemp, upperTemp, temp)
      },
      entropy: {
        f: this.interpolateValue(data1.entropy.f, data2.entropy.f, lowerTemp, upperTemp, temp),
        g: this.interpolateValue(data1.entropy.g, data2.entropy.g, lowerTemp, upperTemp, temp),
        fg: this.interpolateValue(data1.entropy.fg, data2.entropy.fg, lowerTemp, upperTemp, temp)
      }
    };

    return {
      data: interpolatedData,
      bounds: {
        lower: data1,
        upper: data2
      }
    };
  }

  private static interpolateValue(y1: number, y2: number, x1: number, x2: number, x: number): number {
    return y1 + (x - x1) * (y2 - y1) / (x2 - x1);
  }
}

interface InterpolatedResult {
  data: SteamData;
  bounds: {
    lower: SteamData;
    upper: SteamData;
    isExact?: boolean;
  };
} 