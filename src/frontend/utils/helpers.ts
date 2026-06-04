import { TeamEntry } from './types';

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

const normalizeWord = (word: string): string =>
  word.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

export const findTeamIcon = (sideText: string, teamsConfig: TeamEntry[]): string | null => {
  if (!sideText || !teamsConfig || teamsConfig.length === 0) return null;

  const words = sideText.split(/\s+/).map(normalizeWord).filter(Boolean);
  if (words.length === 0) return null;

  for (const entry of teamsConfig) {
    const keywords = entry.words
      .split('|')
      .map(w => normalizeWord(w))
      .filter(Boolean);
    if (keywords.some(k => words.includes(k))) {
      return entry.icon;
    }
  }
  return null;
};

export interface ParsedTeams {
  leftText: string;
  leftIcon: string | null;
  rightText: string;
  rightIcon: string | null;
  separator: string;
}

export const parseTeams = (text: string, teamsConfig: TeamEntry[]): ParsedTeams => {
  if (!text) {
    return { leftText: '', leftIcon: null, rightText: '', rightIcon: null, separator: '' };
  }

  const match = text.match(/^(.+?)\s+(vs\.?|v\.?|x|-)\s+(.+)$/i);
  if (match) {
    const [, leftText, separator, rightText] = match;
    return {
      leftText: leftText.trim(),
      leftIcon: findTeamIcon(leftText, teamsConfig),
      rightText: rightText.trim(),
      rightIcon: findTeamIcon(rightText, teamsConfig),
      separator,
    };
  }

  return {
    leftText: text,
    leftIcon: findTeamIcon(text, teamsConfig),
    rightText: '',
    rightIcon: null,
    separator: '',
  };
};
