import { SteamData } from '../types/steam';
import steamData from '../data/steamData';

interface DataPoint {
  pressure: number;
  temperature: number;
  specificVolume: number;
  density: number;
  internalEnergy: number;
  enthalpy: number;
  entropy: number;
  phase: string;
}

export class CompressedDataLoader {
  private static data: DataPoint[] = [];
  private static initialized = false;
  private static temperatureMap = new Map<number, DataPoint[]>();
  private static pressureMap = new Map<number, DataPoint[]>();

  static initialize(): void {
    if (this.initialized) return;
    
    // Convert array data to structured format
    this.data = steamData.data.map(row => ({
      pressure: Number(row[0]),    // Pressure (MPa)
      temperature: Number(row[1]), // Temperature (°C)
      specificVolume: Number(row[2]), // Specific Volume (m^3/kg)
      density: Number(row[3]),     // Density (kg/m^3)
      internalEnergy: Number(row[4]), // Internal Energy (kJ/kg)
      enthalpy: Number(row[5]),    // Enthalpy (kJ/kg)
      entropy: Number(row[6]),     // Entropy [kJ/(kg K)]
      phase: row[7] as string      // Phase
    }));

    // Create indexes for faster lookups
    this.data.forEach(point => {
      if (!this.temperatureMap.has(point.temperature)) {
        this.temperatureMap.set(point.temperature, []);
      }
      this.temperatureMap.get(point.temperature)!.push(point);

      if (!this.pressureMap.has(point.pressure)) {
        this.pressureMap.set(point.pressure, []);
      }
      this.pressureMap.get(point.pressure)!.push(point);
    });

    this.initialized = true;
  }

  static getData(temperature: number, pressure: number): { 
    data: SteamData; 
    warning?: string;
  } | null {
    const temps = Array.from(this.temperatureMap.keys())
      .sort((a, b) => Math.abs(a - temperature) - Math.abs(b - temperature));
    const pressures = Array.from(this.pressureMap.keys())
      .sort((a, b) => Math.abs(a - pressure) - Math.abs(b - pressure));

    const points = this.data.filter(p => 
      (Math.abs(p.temperature - temps[0]) < 0.1 || Math.abs(p.temperature - temps[1]) < 0.1) &&
      (Math.abs(p.pressure - pressures[0]) < 0.01 || Math.abs(p.pressure - pressures[1]) < 0.01)
    );

    if (points.length === 0) return null;

    const nearest = points[0];
    const warning = points.slice(0, 4).map(p => p.phase)
      .filter((v, i, a) => a.indexOf(v) === i).length > 1 
      ? 'Warning: Interpolation between different phases may be inaccurate'
      : undefined;

    return {
      data: {
        temperature: nearest.temperature,
        pressure: nearest.pressure,
        specificVolume: {
          f: nearest.specificVolume,
          g: nearest.specificVolume,
          fg: 0
        },
        internalEnergy: {
          f: nearest.internalEnergy,
          g: nearest.internalEnergy,
          fg: 0
        },
        enthalpy: {
          f: nearest.enthalpy,
          g: nearest.enthalpy,
          fg: 0
        },
        entropy: {
          f: nearest.entropy,
          g: nearest.entropy,
          fg: 0
        },
        phase: nearest.phase
      },
      warning
    };
  }
} 