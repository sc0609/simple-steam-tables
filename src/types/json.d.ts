declare module '*.json' {
  const value: {
    title: string;
    version: string;
    author: string;
    copyright: string;
    license: string;
    date: string;
    headers: string[];
    data: [number, ...number[]][];
  };
  export default value;
} 