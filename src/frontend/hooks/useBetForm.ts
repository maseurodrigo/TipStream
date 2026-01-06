import { useState } from 'react';
import { Bet, SingleBet, MultipleBet, BettingSite } from '../utils/types';
import { calculateTotalOdds, handleNumberChange } from '../utils/helpers';

interface MultipleTip {
  tip: string;
  odds: string;
  teams: string;
}

export interface UseBetFormReturn {
  betType: 'single' | 'multiple';
  setBetType: (type: 'single' | 'multiple') => void;
  newTip: string;
  setNewTip: (tip: string) => void;
  newTeams: string;
  setNewTeams: (teams: string) => void;
  newOdds: string;
  setNewOdds: (odds: string) => void;
  newSite: string;
  setNewSite: (site: string) => void;
  newBalance: string;
  setNewBalance: (balance: string) => void;
  newBalanceType: 'units' | 'money';
  setNewBalanceType: (type: 'units' | 'money') => void;
  multipleTips: MultipleTip[];
  setMultipleTips: (tips: MultipleTip[]) => void;
  addTip: () => void;
  removeTip: (index: number) => void;
  updateMultipleTip: (index: number, field: 'tip' | 'odds' | 'teams', value: string) => void;
  handleOddsChange: (value: string) => void;
  handleBalanceChange: (value: string) => void;
  resetForm: (defaultSite: string) => void;
  submitBet: () => Bet | null;
}

export const useBetForm = (bettingSites: BettingSite[]): UseBetFormReturn => {
  const [betType, setBetType] = useState<'single' | 'multiple'>('single');
  const [newTip, setNewTip] = useState('');
  const [newTeams, setNewTeams] = useState('');
  const [newOdds, setNewOdds] = useState('');
  const [newSite, setNewSite] = useState(bettingSites[0]?.value || '');
  const [newBalance, setNewBalance] = useState('');
  const [newBalanceType, setNewBalanceType] = useState<'units' | 'money'>('units');
  const [multipleTips, setMultipleTips] = useState<MultipleTip[]>([{ tip: '', odds: '', teams: '' }]);

  const addTip = () => {
    setMultipleTips([...multipleTips, { tip: '', odds: '', teams: '' }]);
  };

  const removeTip = (index: number) => {
    setMultipleTips(multipleTips.filter((_, i) => i !== index));
  };

  const updateMultipleTip = (index: number, field: 'tip' | 'odds' | 'teams', value: string) => {
    const newTips = [...multipleTips];
    if (field === 'odds') {
      const regex = /^\d*\.?\d*$/;
      if (!regex.test(value) && value !== '') return;
    }
    newTips[index] = { ...newTips[index], [field]: value };
    setMultipleTips(newTips);
  };

  const handleOddsChange = (value: string) => {
    handleNumberChange(value, setNewOdds);
  };

  const handleBalanceChange = (value: string) => {
    handleNumberChange(value, setNewBalance);
  };

  const resetForm = (defaultSite: string) => {
    setNewTip('');
    setNewTeams('');
    setNewOdds('');
    setNewSite(defaultSite || bettingSites[0]?.value);
    setNewBalance('');
    setNewBalanceType('units');
    setMultipleTips([{ tip: '', odds: '', teams: '' }]);
    setBetType('single');
  };

  const submitBet = (): Bet | null => {
    if (betType === 'single') {
      if (!newTip.trim()) return null;

      const bet: SingleBet = {
        id: crypto.randomUUID(),
        tip: newTip.trim(),
        teams: newTeams.trim(),
        odds: newOdds.trim(),
        site: newSite,
        balance: newBalance.trim(),
        balanceType: newBalanceType,
        status: 'pending',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'single'
      };

      return bet;
    } else {
      const validTips = multipleTips.filter(tip => tip.tip.trim() && tip.odds.trim() && tip.teams.trim());
      if (validTips.length < 2) return null;

      const bet: MultipleBet = {
        id: crypto.randomUUID(),
        tips: validTips,
        balance: newBalance.trim(),
        balanceType: newBalanceType,
        totalOdds: calculateTotalOdds(validTips),
        site: newSite,
        status: 'pending',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'multiple'
      };

      return bet;
    }
  };

  return {
    betType,
    setBetType,
    newTip,
    setNewTip,
    newTeams,
    setNewTeams,
    newOdds,
    setNewOdds,
    newSite,
    setNewSite,
    newBalance,
    setNewBalance,
    newBalanceType,
    setNewBalanceType,
    multipleTips,
    setMultipleTips,
    addTip,
    removeTip,
    updateMultipleTip,
    handleOddsChange,
    handleBalanceChange,
    resetForm,
    submitBet,
  };
};
