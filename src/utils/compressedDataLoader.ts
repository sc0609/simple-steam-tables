import { SteamData } from '../types/steam';
import compressedData from '../data/compressed_liquid_and_superheated_steam_V1.3.json';

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
  private static dataPoints: DataPoint[] = [];
  private static initialized = false;
  private static temperatureMap = new Map<number, DataPoint[]>();
  private static pressureMap = new Map<number, DataPoint[]>();

  static initialize() {
    if (this.initialized) return;
    
    // Convert data to structured format and create indexes
    this.dataPoints = compressedData.data.map(([p, t, v, d, u, h, s, phase]) => ({
      pressure: p,
      temperature: t,
      specificVolume: v,
      density: d,
      internalEnergy: u,
      enthalpy: h,
      entropy: s,
      phase: phase as string
    }));

    // Create temperature and pressure indexes for faster lookups
    this.dataPoints.forEach(point => {
      // Temperature index
      if (!this.temperatureMap.has(point.temperature)) {
        this.temperatureMap.set(point.temperature, []);
      }
      this.temperatureMap.get(point.temperature)!.push(point);

      // Pressure index
      if (!this.pressureMap.has(point.pressure)) {
        this.pressureMap.set(point.pressure, []);
      }
      this.pressureMap.get(point.pressure)!.push(point);
    });

    this.initialized = true;
  }

  static getData(temperature: number, pressure: number) {
    // Find closest temperature and pressure points
    const temps = Array.from(this.temperatureMap.keys()).sort((a, b) => Math.abs(a - temperature) - Math.abs(b - temperature));
    const pressures = Array.from(this.pressureMap.keys()).sort((a, b) => Math.abs(a - pressure) - Math.abs(b - pressure));

    // Get the closest points
    const points = this.dataPoints.filter(p => 
      (Math.abs(p.temperature - temps[0]) < 0.1 || Math.abs(p.temperature - temps[1]) < 0.1) &&
      (Math.abs(p.pressure - pressures[0]) < 0.01 || Math.abs(p.pressure - pressures[1]) < 0.01)
    );

    if (points.length === 0) {
      return null;
    }

    // Sort by distance to target point
    points.sort((a, b) => {
      const distA = Math.sqrt(
        Math.pow((a.temperature - temperature) / 373.95, 2) + // Normalize by max values
        Math.pow((a.pressure - pressure) / 1000, 2)
      );
      const distB = Math.sqrt(
        Math.pow((b.temperature - temperature) / 373.95, 2) +
        Math.pow((b.pressure - pressure) / 1000, 2)
      );
      return distA - distB;
    });

    const nearest = points[0];
    const phases = new Set(points.slice(0, 4).map(p => p.phase));

    let warning = '';
    if (phases.size > 1) {
      warning = 'Warning: Interpolation between different phases may be inaccurate. The lower and upper bounds must be the same phase for accurate interpolation.';
    }

    return {
      data: {
        temperature: nearest.temperature,
        pressure: nearest.pressure,
        specificVolume: nearest.specificVolume,
        internalEnergy: nearest.internalEnergy,
        enthalpy: nearest.enthalpy,
        entropy: nearest.entropy,
        phase: nearest.phase
      } as SteamData,
      warning
    };
  }
} 