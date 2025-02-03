import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { SteamData, UnitSystem } from '../types/steam';
import { convertValue } from '../utils/unitConverter';

interface PropertyTableProps {
  data: SteamData;
  unitSystem: UnitSystem;
}

interface PropertyRow {
  name: string;
  value: number;
  metricUnit: string;
  imperialUnit: string;
  conversionFactor: number;
}

export function PropertyTable({ data, unitSystem }: PropertyTableProps) {
  const properties: PropertyRow[] = [
    {
      name: 'Pressure',
      value: data.pressure,
      metricUnit: 'MPa',
      imperialUnit: 'psi',
      conversionFactor: 145.038
    },
    {
      name: 'Specific Volume (Liquid)',
      value: data.specificVolumeLiquid,
      metricUnit: 'm³/kg',
      imperialUnit: 'ft³/lb',
      conversionFactor: 16.0185
    },
    {
      name: 'Specific Volume (Vapor)',
      value: data.specificVolumeVapor,
      metricUnit: 'm³/kg',
      imperialUnit: 'ft³/lb',
      conversionFactor: 16.0185
    },
    {
      name: 'Internal Energy (Liquid)',
      value: data.internalEnergyLiquid,
      metricUnit: 'kJ/kg',
      imperialUnit: 'BTU/lb',
      conversionFactor: 0.429923
    },
    {
      name: 'Internal Energy (Vapor)',
      value: data.internalEnergyVapor,
      metricUnit: 'kJ/kg',
      imperialUnit: 'BTU/lb',
      conversionFactor: 0.429923
    },
    {
      name: 'Enthalpy (Liquid)',
      value: data.enthalpyLiquid,
      metricUnit: 'kJ/kg',
      imperialUnit: 'BTU/lb',
      conversionFactor: 0.429923
    },
    {
      name: 'Enthalpy (Vapor)',
      value: data.enthalpyVapor,
      metricUnit: 'kJ/kg',
      imperialUnit: 'BTU/lb',
      conversionFactor: 0.429923
    },
    {
      name: 'Entropy (Liquid)',
      value: data.entropyLiquid,
      metricUnit: 'kJ/(kg·K)',
      imperialUnit: 'BTU/(lb·°F)',
      conversionFactor: 0.239006
    },
    {
      name: 'Entropy (Vapor)',
      value: data.entropyVapor,
      metricUnit: 'kJ/(kg·K)',
      imperialUnit: 'BTU/(lb·°F)',
      conversionFactor: 0.239006
    }
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Property</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell>Unit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {properties.map((prop) => (
            <TableRow key={prop.name}>
              <TableCell>{prop.name}</TableCell>
              <TableCell align="right">
                {unitSystem === 'metric' 
                  ? prop.value.toFixed(6)
                  : (prop.value * prop.conversionFactor).toFixed(6)
                }
              </TableCell>
              <TableCell>
                {unitSystem === 'metric' ? prop.metricUnit : prop.imperialUnit}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
} 