export interface SingleBet {
  id: string;
  tip: string;
  teams: string;
  odds: string;
  site: string;
  balance: string;
  balanceType: 'units' | 'money';
  status: 'pending' | 'green' | 'red' | 'void' | 'half-win' | 'half-loss';
  timestamp: string;
  type: 'single';
}

export interface MultipleBet {
  id: string;
  tips: {
    tip: string;
    teams: string;
    odds: string;
  }[];
  balance: string;
  balanceType: 'units' | 'money';
  totalOdds: string;
  site: string;
  status: 'pending' | 'green' | 'red' | 'void' | 'half-win' | 'half-loss';
  timestamp: string;
  type: 'multiple';
}

export type Bet = SingleBet | MultipleBet;

export interface BettingSite {
  value: string;
  label: string;
  logo: string;
}

export interface DisplaySettings {
  tipsBoxWidth: number;
  tipsBoxHeight: number;
  maxHeightMode: boolean;
  showHeader: boolean;
  showPnLTracker: boolean;
  carouselMode: boolean;
  headerTitle: string;
  logoUrl: string;
  logoSize: number;
  baseColor: string;
  opacity: number;
  maxBetsPCol: number;
  carouselTimer: number;
}
