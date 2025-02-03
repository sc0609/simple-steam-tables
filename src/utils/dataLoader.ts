import { SteamData, InterpolationBounds } from '../types/steam';
import steamData from '../data/saturated_by_temperature_V1.5.json';

interface InterpolationResult {
  data: SteamData;
  bounds: InterpolationBounds;
}

export class SteamDataLoader {
  private static tempMap = new Map<number, SteamData>();

  static initialize() {
    // Store temperatures in sorted array for easier lookup
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

  static getInterpolatedData(temperature: number): InterpolationResult | null {
    // First check if the exact temperature exists in the dataset
    if (this.tempMap.has(temperature)) {
      const data = this.tempMap.get(temperature)!;
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
    const lowerTemp = Math.floor(temperature);
    const upperTemp = Math.ceil(temperature);

    // Get the data for these temperatures
    const data1 = this.tempMap.get(lowerTemp);
    const data2 = this.tempMap.get(upperTemp);

    if (!data1 || !data2) return null;

    // Linear interpolation (decided not to use this)
    // const fraction = (temperature - lowerTemp) / (upperTemp - lowerTemp);

    const interpolatedData = {
      temperature: temperature,
      pressure: this.interpolateValue(data1.pressure, data2.pressure, lowerTemp, upperTemp, temperature),
      specificVolume: {
        f: this.interpolateValue(data1.specificVolume.f, data2.specificVolume.f, lowerTemp, upperTemp, temperature),
        g: this.interpolateValue(data1.specificVolume.g, data2.specificVolume.g, lowerTemp, upperTemp, temperature),
        fg: this.interpolateValue(data1.specificVolume.fg, data2.specificVolume.fg, lowerTemp, upperTemp, temperature)
      },
      internalEnergy: {
        f: this.interpolateValue(data1.internalEnergy.f, data2.internalEnergy.f, lowerTemp, upperTemp, temperature),
        g: this.interpolateValue(data1.internalEnergy.g, data2.internalEnergy.g, lowerTemp, upperTemp, temperature),
        fg: this.interpolateValue(data1.internalEnergy.fg, data2.internalEnergy.fg, lowerTemp, upperTemp, temperature)
      },
      enthalpy: {
        f: this.interpolateValue(data1.enthalpy.f, data2.enthalpy.f, lowerTemp, upperTemp, temperature),
        g: this.interpolateValue(data1.enthalpy.g, data2.enthalpy.g, lowerTemp, upperTemp, temperature),
        fg: this.interpolateValue(data1.enthalpy.fg, data2.enthalpy.fg, lowerTemp, upperTemp, temperature)
      },
      entropy: {
        f: this.interpolateValue(data1.entropy.f, data2.entropy.f, lowerTemp, upperTemp, temperature),
        g: this.interpolateValue(data1.entropy.g, data2.entropy.g, lowerTemp, upperTemp, temperature),
        fg: this.interpolateValue(data1.entropy.fg, data2.entropy.fg, lowerTemp, upperTemp, temperature)
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
