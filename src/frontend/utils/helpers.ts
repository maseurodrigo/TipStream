export const getColorWithOpacity = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  return arr.reduce((acc: T[][], _, i) => {
    if (i % size === 0) acc.push(arr.slice(i, i + size));
    return acc;
  }, []);
};

export const calculateTotalOdds = (tips: { tip: string; odds: string; teams?: string }[]): string => {
  const total = tips.reduce((acc, curr) => {
    const odds = parseFloat(curr.odds) || 0;
    return acc * (odds || 1);
  }, 1);
  return total.toFixed(2);
};

export const handleNumberChange = (value: string, setter: (value: string) => void): void => {
  const regex = /^\d*\.?\d*$/;
  if (value === '' || regex.test(value)) {
    setter(value);
  }
};
