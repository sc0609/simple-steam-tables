# Simple Steam Tables

A modern, simple and interactive web application for calculating thermodynamic properties of water and steam. Built with React, TypeScript, and Material-UI.

![Steam Tables Screenshot](https://github.com/sc0609/simple-steam-tables/blob/main/src/assets/Screenshot.png)

## Features

- **Three Calculation Modes**:
  - Temperature-based saturated properties
  - Pressure-based saturated properties
  - Compressed liquid & superheated steam properties (T-P based)

- **Interactive Interface**:
  - Real-time property calculations
  - Customizable unit preferences
  - Collapsible property sections
  - Phase warnings and interpolation details

- **Supported Properties**:
  - Pressure
  - Temperature
  - Specific Volume
  - Internal Energy
  - Enthalpy
  - Entropy
  - Phase information

- **Unit Conversions**:
  - Temperature: °C
  - Pressure: MPa, bar, kPa, psi
  - Specific Volume: m³/kg, cm³/g, ft³/lb
  - Energy: kJ/kg, kcal/kg, BTU/lb
  - Entropy: kJ/(kg·K)

## Data Source

The thermodynamic data is sourced from NIST via the University of Colorado Boulder's Department of Chemical and Biological Engineering ([ visit here for more details ](https://learncheme.com/student-resources/steam-tables/)). The data covers:
- Saturated properties from 0.01°C to 373.95°C
- Pressure range from 0.000611657 MPa to 22.064 MPa
- Compressed and superheated properties up to 1000 MPa

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/sc0609/simple-steam-tables.git

# Navigate to project directory
cd simple-steam-tables

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production
```bash
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- University of Colorado Boulder for providing the steam table data
- Material-UI team for the component library
- All contributors and users of this project

## Author

Created by [Sarthak Chavhan](https://www.linkedin.com/in/sarthak-chavhan-4a87a422a/)

## Links

- [Live Demo](https://simple-steam-tables.vercel.app)
- [GitHub Repository](https://github.com/sc0609/simple-steam-tables)
- [Report Issues](https://github.com/sc0609/simple-steam-tables/issues)
