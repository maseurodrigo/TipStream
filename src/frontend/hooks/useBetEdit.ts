import { useState } from 'react';
import { Bet, SingleBet, MultipleBet } from '../utils/types';
import { calculateTotalOdds, handleNumberChange } from '../utils/helpers';

interface MultipleTip {
  tip: string;
  odds: string;
  teams: string;
}

export interface UseBetEditReturn {
  editingId: string | null;
  editText: string;
  setEditText: (text: string) => void;
  editTeams: string;
  setEditTeams: (teams: string) => void;
  editOdds: string;
  setEditOdds: (odds: string) => void;
  editSite: string;
  setEditSite: (site: string) => void;
  editBalance: string;
  setEditBalance: (balance: string) => void;
  editBalanceType: 'units' | 'money';
  setEditBalanceType: (type: 'units' | 'money') => void;
  editingMultipleTips: MultipleTip[];
  setEditingMultipleTips: (tips: MultipleTip[]) => void;
  startEdit: (bet: Bet, defaultSite: string) => void;
  saveEdit: (bets: Bet[]) => Bet[] | null;
  cancelEdit: () => void;
  addEditTip: () => void;
  removeEditTip: (index: number) => void;
  updateEditMultipleTip: (index: number, field: 'tip' | 'odds' | 'teams', value: string) => void;
  handleEditOddsChange: (value: string) => void;
  handleEditBalanceChange: (value: string) => void;
}

export const useBetEdit = (defaultSite: string): UseBetEditReturn => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editTeams, setEditTeams] = useState('');
  const [editOdds, setEditOdds] = useState('');
  const [editSite, setEditSite] = useState(defaultSite);
  const [editBalance, setEditBalance] = useState('');
  const [editBalanceType, setEditBalanceType] = useState<'units' | 'money'>('units');
  const [editingMultipleTips, setEditingMultipleTips] = useState<MultipleTip[]>([]);

  const startEdit = (bet: Bet) => {
    setEditingId(bet.id);
    if (bet.type === 'single') {
      setEditText(bet.tip);
      setEditTeams(bet.teams);
      setEditOdds(bet.odds);
      setEditSite(bet.site);
      setEditBalance(bet.balance);
      setEditBalanceType(bet.balanceType);
    } else {
      setEditingMultipleTips(bet.tips.map(tip => ({ ...tip })));
      setEditSite(bet.site);
      setEditBalance(bet.balance);
      setEditBalanceType(bet.balanceType);
    }
  };

  const saveEdit = (bets: Bet[]): Bet[] | null => {
    if (!editingId) return null;

    const updatedBets = bets.map((bet) => {
      if (bet.id === editingId) {
        if (bet.type === 'single') {
          return {
            ...bet,
            tip: editText.trim(),
            teams: editTeams.trim(),
            odds: editOdds.trim(),
            site: editSite,
            balance: editBalance.trim(),
            balanceType: editBalanceType
          } as SingleBet;
        } else {
          const validTips = editingMultipleTips.filter(tip => tip.tip.trim() && tip.odds.trim());
          if (validTips.length < 2) return bet;
          return {
            ...bet,
            tips: validTips,
            site: editSite,
            balance: editBalance.trim(),
            balanceType: editBalanceType,
            totalOdds: calculateTotalOdds(validTips)
          } as MultipleBet;
        }
      }
      return bet;
    });

    cancelEdit();
    return updatedBets;
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditTeams('');
    setEditOdds('');
    setEditBalance('');
    setEditBalanceType('units');
    setEditingMultipleTips([]);
  };

  const addEditTip = () => {
    setEditingMultipleTips([...editingMultipleTips, { tip: '', odds: '', teams: '' }]);
  };

  const removeEditTip = (index: number) => {
    setEditingMultipleTips(editingMultipleTips.filter((_, i) => i !== index));
  };

  const updateEditMultipleTip = (index: number, field: 'tip' | 'odds' | 'teams', value: string) => {
    const newTips = [...editingMultipleTips];
    if (field === 'odds') {
      const regex = /^\d*\.?\d*$/;
      if (!regex.test(value) && value !== '') return;
    }
    newTips[index] = { ...newTips[index], [field]: value };
    setEditingMultipleTips(newTips);
  };

  const handleEditOddsChange = (value: string) => {
    handleNumberChange(value, setEditOdds);
  };

  const handleEditBalanceChange = (value: string) => {
    handleNumberChange(value, setEditBalance);
  };

  return {
    editingId,
    editText,
    setEditText,
    editTeams,
    setEditTeams,
    editOdds,
    setEditOdds,
    editSite,
    setEditSite,
    editBalance,
    setEditBalance,
    editBalanceType,
    setEditBalanceType,
    editingMultipleTips,
    setEditingMultipleTips,
    startEdit,
    saveEdit,
    cancelEdit,
    addEditTip,
    removeEditTip,
    updateEditMultipleTip,
    handleEditOddsChange,
    handleEditBalanceChange,
  };
};
