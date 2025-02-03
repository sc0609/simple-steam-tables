import { SteamData } from '../types/steam';
import steamData from '../data/saturated_by_pressure_V1.4.json';

export class PressureDataLoader {
  private static pressureMap = new Map<number, SteamData>();
  private static pressures: number[] = [];
  private static initialized = false;
  private static pressureRanges: { start: number; end: number; index: number }[] = [];

  static initialize() {
    if (this.initialized) return;
    
    // Store pressures in sorted array for easier lookup
    this.pressures = steamData.data.map(([p]) => p).sort((a, b) => a - b);
    
    // Create pressure ranges for faster lookup
    this.pressureRanges = [];
    for (let i = 0; i < this.pressures.length - 1; i++) {
      this.pressureRanges.push({
        start: this.pressures[i],
        end: this.pressures[i + 1],
        index: i
      });
    }
    
    steamData.data.forEach(([p, t, vf, vg, uf, ug, ufg, hf, hg, hfg, sf, sg, sfg]) => {
      this.pressureMap.set(p, {
        pressure: p,
        temperature: t,
        specificVolume: { f: vf, g: vg, fg: vg - vf },
        internalEnergy: { f: uf, g: ug, fg: ufg },
        enthalpy: { f: hf, g: hg, fg: hfg },
        entropy: { f: sf, g: sg, fg: sfg }
      });
    });

    this.initialized = true;
  }

  static getInterpolatedData(pressure: number): InterpolatedResult | null {
    // First check if the exact pressure exists in the dataset
    if (this.pressureMap.has(pressure)) {
      const data = this.pressureMap.get(pressure)!;
      return {
        data,
        bounds: {
          lower: { pressure: pressure, ...data },
          upper: { pressure: pressure, ...data },
          isExact: true
        }
      };
    }

    // Binary search for the pressure range
    const range = this.findPressureRange(pressure);
    if (!range) return null;

    const p1 = this.pressures[range.index];
    const p2 = this.pressures[range.index + 1];

    const data1 = this.pressureMap.get(p1);
    const data2 = this.pressureMap.get(p2);

    if (!data1 || !data2) return null;

    // Linear interpolation
    const interpolatedData = this.interpolateData(data1, data2, p1, p2, pressure);

    return {
      data: interpolatedData,
      bounds: {
        lower: { pressure: p1, ...data1 },
        upper: { pressure: p2, ...data2 },
        isExact: false
      }
    };
  }

  private static findPressureRange(pressure: number) {
    let left = 0;
    let right = this.pressureRanges.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const range = this.pressureRanges[mid];

      if (pressure >= range.start && pressure <= range.end) {
        return range;
      }

      if (pressure < range.start) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    return null;
  }

  private static interpolateData(data1: SteamData, data2: SteamData, p1: number, p2: number, p: number): SteamData {
    return {
      pressure: p,
      temperature: this.interpolateValue(data1.temperature, data2.temperature, p1, p2, p),
      specificVolume: this.interpolateProperty(data1.specificVolume, data2.specificVolume, p1, p2, p),
      internalEnergy: this.interpolateProperty(data1.internalEnergy, data2.internalEnergy, p1, p2, p),
      enthalpy: this.interpolateProperty(data1.enthalpy, data2.enthalpy, p1, p2, p),
      entropy: this.interpolateProperty(data1.entropy, data2.entropy, p1, p2, p)
    };
  }

  private static interpolateProperty(prop1: any, prop2: any, p1: number, p2: number, p: number) {
    return {
      f: this.interpolateValue(prop1.f, prop2.f, p1, p2, p),
      g: this.interpolateValue(prop1.g, prop2.g, p1, p2, p),
      fg: this.interpolateValue(prop1.fg, prop2.fg, p1, p2, p)
    };
  }

  private static interpolateValue(y1: number, y2: number, x1: number, x2: number, x: number): number {
    return y1 + (x - x1) * (y2 - y1) / (x2 - x1);
  }

  static getPressures(): number[] {
    return [...this.pressures];
  }
}

interface InterpolatedResult {
  data: SteamData;
  bounds: {
    lower: { pressure: number; temperature: number; specificVolume: { f: number; g: number; fg: number }; internalEnergy: { f: number; g: number; fg: number }; enthalpy: { f: number; g: number; fg: number }; entropy: { f: number; g: number; fg: number } };
    upper: { pressure: number; temperature: number; specificVolume: { f: number; g: number; fg: number }; internalEnergy: { f: number; g: number; fg: number }; enthalpy: { f: number; g: number; fg: number }; entropy: { f: number; g: number; fg: number } };
    isExact: boolean;
  };
} 