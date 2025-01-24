import React, { useState } from 'react';
import { PlusCircle, X, Check, Settings, Trash2, Pencil, Plus, Eye, EyeOff } from 'lucide-react';

interface SingleBet {
  id: string;
  tip: string;
  odds: string;
  balance: string;
  balanceType: 'units' | 'money';
  status: 'pending' | 'green' | 'red';
  timestamp: string;
  type: 'single';
}

interface MultipleBet {
  id: string;
  tips: {
    tip: string;
    odds: string;
  }[];
  balance: string;
  balanceType: 'units' | 'money';
  totalOdds: string;
  status: 'pending' | 'green' | 'red';
  timestamp: string;
  type: 'multiple';
}

type Bet = SingleBet | MultipleBet;

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [newTip, setNewTip] = useState('');
  const [newOdds, setNewOdds] = useState('');
  const [newBalance, setNewBalance] = useState('');
  const [newBalanceType, setNewBalanceType] = useState<'units' | 'money'>('units');
  const [bets, setBets] = useState<Bet[]>([]);
  const [baseColor, setBaseColor] = useState('#2D3748');
  const [opacity, setOpacity] = useState(0.9);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editOdds, setEditOdds] = useState('');
  const [editBalance, setEditBalance] = useState('');
  const [editBalanceType, setEditBalanceType] = useState<'units' | 'money'>('units');
  const [editingMultipleTips, setEditingMultipleTips] = useState<{ tip: string; odds: string }[]>([]);
  const [logoUrl, setLogoUrl] = useState('');
  const [headerTitle, setHeaderTitle] = useState('Live Tips');
  const [betType, setBetType] = useState<'single' | 'multiple'>('single');
  const [multipleTips, setMultipleTips] = useState<{ tip: string; odds: string }[]>([{ tip: '', odds: '' }]);
  const [isStreamMode, setIsStreamMode] = useState(false);

  const handleNumberChange = (value: string, setter: (value: string) => void) => {
    const regex = /^\d*\.?\d*$/;
    if (value === '' || regex.test(value)) {
      setter(value);
    }
  };

  const calculateTotalOdds = (tips: { tip: string; odds: string }[]): string => {
    const total = tips.reduce((acc, curr) => {
      const odds = parseFloat(curr.odds) || 0;
      return acc * (odds || 1);
    }, 1);
    return total.toFixed(2);
  };

  const addTip = (isEditing: boolean = false) => {
    if (isEditing) {
      setEditingMultipleTips([...editingMultipleTips, { tip: '', odds: '' }]);
    } else {
      setMultipleTips([...multipleTips, { tip: '', odds: '' }]);
    }
  };

  const removeTip = (index: number, isEditing: boolean = false) => {
    if (isEditing) {
      setEditingMultipleTips(editingMultipleTips.filter((_, i) => i !== index));
    } else {
      setMultipleTips(multipleTips.filter((_, i) => i !== index));
    }
  };

  const updateMultipleTip = (index: number, field: 'tip' | 'odds', value: string, isEditing: boolean = false) => {
    const newTips = isEditing ? [...editingMultipleTips] : [...multipleTips];
    if (field === 'odds') {
      const regex = /^\d*\.?\d*$/;
      if (!regex.test(value) && value !== '') return;
    }
    newTips[index] = { ...newTips[index], [field]: value };
    if (isEditing) {
      setEditingMultipleTips(newTips);
    } else {
      setMultipleTips(newTips);
    }
  };

  const resetForm = () => {
    setNewTip('');
    setNewOdds('');
    setNewBalance('');
    setNewBalanceType('units');
    setMultipleTips([{ tip: '', odds: '' }]);
    setBetType('single');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (betType === 'single') {
      if (!newTip.trim()) return;

      const bet: SingleBet = {
        id: crypto.randomUUID(),
        tip: newTip.trim(),
        odds: newOdds.trim(),
        balance: newBalance.trim(),
        balanceType: newBalanceType,
        status: 'pending',
        timestamp: new Date().toLocaleTimeString(),
        type: 'single'
      };

      setBets((prev) => [...prev, bet]);
    } else {
      const validTips = multipleTips.filter(tip => tip.tip.trim() && tip.odds.trim());
      if (validTips.length < 2) return;

      const bet: MultipleBet = {
        id: crypto.randomUUID(),
        tips: validTips,
        balance: newBalance.trim(),
        balanceType: newBalanceType,
        totalOdds: calculateTotalOdds(validTips),
        status: 'pending',
        timestamp: new Date().toLocaleTimeString(),
        type: 'multiple'
      };

      setBets((prev) => [...prev, bet]);
    }

    resetForm();
    setIsFormOpen(false);
  };

  const updateBetStatus = (id: string, newStatus: 'green' | 'red') => {
    setBets((prev) =>
      prev.map((bet) => {
        if (bet.id === id) {
          return {
            ...bet,
            status: bet.status === newStatus ? 'pending' : newStatus
          };
        }
        return bet;
      })
    );
  };

  const deleteBet = (id: string) => {
    setBets((prev) => prev.filter((bet) => bet.id !== id));
  };

  const startEdit = (bet: Bet) => {
    setEditingId(bet.id);
    if (bet.type === 'single') {
      setEditText(bet.tip);
      setEditOdds(bet.odds);
      setEditBalance(bet.balance);
      setEditBalanceType(bet.balanceType);
    } else {
      setEditingMultipleTips(bet.tips.map(tip => ({ ...tip })));
      setEditBalance(bet.balance);
      setEditBalanceType(bet.balanceType);
    }
  };

  const saveEdit = () => {
    if (!editingId) return;
    
    setBets((prev) =>
      prev.map((bet) => {
        if (bet.id === editingId) {
          if (bet.type === 'single') {
            return { 
              ...bet, 
              tip: editText.trim(), 
              odds: editOdds.trim(),
              balance: editBalance.trim(),
              balanceType: editBalanceType
            };
          } else {
            const validTips = editingMultipleTips.filter(tip => tip.tip.trim() && tip.odds.trim());
            if (validTips.length < 2) return bet;
            return {
              ...bet,
              tips: validTips,
              balance: editBalance.trim(),
              balanceType: editBalanceType,
              totalOdds: calculateTotalOdds(validTips)
            };
          }
        }
        return bet;
      })
    );
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditOdds('');
    setEditBalance('');
    setEditBalanceType('units');
    setEditingMultipleTips([]);
  };

  const getColorWithOpacity = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ backgroundColor: getColorWithOpacity(baseColor, 0.5) }}>
      {/* Control Buttons */}
      <div className="fixed top-6 right-6 flex gap-4 pointer-events-auto z-50">
        <button
          onClick={() => setIsStreamMode(!isStreamMode)}
          className="bg-gray-900/90 hover:bg-gray-800 text-white rounded-2xl p-4 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transform hover:scale-105 backdrop-blur-lg border border-gray-700/30"
          title={isStreamMode ? "Switch to Edit Mode" : "Switch to Stream Mode"}
        >
          {isStreamMode ? <Eye size={24} /> : <EyeOff size={24} />}
        </button>
        <button
          onClick={() => setIsConfigOpen(true)}
          className="bg-gray-900/90 hover:bg-gray-800 text-white rounded-2xl p-4 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transform hover:scale-105 backdrop-blur-lg border border-gray-700/30"
        >
          <Settings size={24} className="transform hover:rotate-90 transition-transform duration-300" />
        </button>
        <button
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="text-white rounded-2xl p-4 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:shadow-[0_0_20px_rgba(0,0,0,0.3)] transform hover:scale-105 backdrop-blur-lg border border-white/10"
          style={{ backgroundColor: baseColor }}
        >
          <PlusCircle size={24} className="transform hover:rotate-180 transition-transform duration-300" />
        </button>
      </div>

      {/* Configuration Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center pointer-events-auto z-50">
          <div 
            className="bg-gray-900/95 p-8 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(0,0,0,0.3)] transform transition-all duration-300 border border-gray-700/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">Overlay Settings</h2>
              <button
                onClick={() => setIsConfigOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">Title</label>
                <input
                  type="text"
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  placeholder="Enter a title..."
                  className="w-full p-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-3">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="Enter logo URL..."
                  className="w-full p-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                />
                {logoUrl && (
                  <div className="mt-2 p-2 bg-gray-800/50 rounded-xl">
                    <img
                      src={logoUrl}
                      alt="Logo preview"
                      className="h-8 w-8 object-cover rounded-full mx-auto"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                      }}
                      onLoad={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'block';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-3">
                    Base Color
                  </label>
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-full h-14 rounded-xl cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-3">Header Color Opacity ({Math.round(opacity * 100)}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={opacity * 100}
                    onChange={(e) => setOpacity(parseInt(e.target.value) / 100)}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${getColorWithOpacity(baseColor, 1)}, ${getColorWithOpacity(baseColor, 1)} ${opacity * 100}%, #374151 ${opacity * 100}%, #374151)`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Input Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center pointer-events-auto z-50">
          <div 
            className="bg-gray-900/95 p-8 rounded-3xl w-full max-w-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] transform transition-all duration-300 border border-gray-700/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">Add New Tip</h2>
              <button
                onClick={() => {
                  resetForm();
                  setIsFormOpen(false);
                }}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-xl"
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setBetType('single')}
                  className={`flex-1 py-2 px-4 rounded-xl transition-all duration-300 ${
                    betType === 'single'
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Single Bet
                </button>
                <button
                  type="button"
                  onClick={() => setBetType('multiple')}
                  className={`flex-1 py-2 px-4 rounded-xl transition-all duration-300 ${
                    betType === 'multiple'
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Multiple Bet
                </button>
              </div>

              {betType === 'single' ? (
                <>
                  <div>
                    <input
                      type="text"
                      value={newTip}
                      onChange={(e) => setNewTip(e.target.value)}
                      placeholder="Enter betting tip..."
                      className="w-full p-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300 text-lg"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={newOdds}
                        onChange={(e) => handleNumberChange(e.target.value, setNewOdds)}
                        placeholder="Enter odds (e.g., 1.75)..."
                        className="w-full p-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300 text-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={newBalance}
                          onChange={(e) => handleNumberChange(e.target.value, setNewBalance)}
                          placeholder={newBalanceType === 'units' ? "Enter units..." : "Enter amount..."}
                          className="flex-1 p-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300 text-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setNewBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                          className="px-3 rounded-xl bg-gray-800/50 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
                        >
                          {newBalanceType === 'units' ? 'Units' : 'Money'}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {multipleTips.map((tip, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={tip.tip}
                          onChange={(e) => updateMultipleTip(index, 'tip', e.target.value)}
                          placeholder={`Tip ${index + 1}`}
                          className="w-full p-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={tip.odds}
                          onChange={(e) => updateMultipleTip(index, 'odds', e.target.value)}
                          placeholder="Odds"
                          className="w-full p-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                        />
                      </div>
                      {multipleTips.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTip(index)}
                          className="p-3 rounded-xl hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/30"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addTip()}
                    className="w-full py-3 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/30 flex items-center justify-center"
                  >
                    <Plus size={20} />
                  </button>
                  {multipleTips.length > 1 && (
                    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400">Total Odds: <span className="text-white font-medium">{calculateTotalOdds(multipleTips)}</span></p>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          inputMode="decimal"
                          value={newBalance}
                          onChange={(e) => handleNumberChange(e.target.value, setNewBalance)}
                          placeholder={newBalanceType === 'units' ? "Enter units..." : "Enter amount..."}
                          className="flex-1 p-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                        />
                        <button
                          type="button"
                          onClick={() => setNewBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                          className="px-3 rounded-xl bg-gray-800/50 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
                        >
                          {newBalanceType === 'units' ? 'Units' : 'Money'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl transition-all duration-300 text-white font-medium shadow-lg hover:shadow-2xl text-lg"
                style={{ backgroundColor: baseColor }}
              >
                Add {betType === 'single' ? 'Single Bet' : 'Multiple Bet'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Betting Tips Box */}
      <div 
        className="pointer-events-auto inline-block fixed top-6 left-6"
        style={{
          minWidth: '20rem',
          maxWidth: '90vw',
          zIndex: 10
        }}
      >
        <div className="bg-gray-900/90 backdrop-blur-lg shadow-[0_0_35px_rgba(0,0,0,0.2)] hover:shadow-[0_0_50px_rgba(0,0,0,0.3)] transition-shadow duration-300">
          <div 
            className="p-6" 
            style={{ 
              backgroundColor: getColorWithOpacity(baseColor, opacity)
            }}
          >
            <div className="flex items-center justify-center gap-4">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="h-8 w-8 object-cover rounded-full"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                  }}
                />
              )}
              <h1 className="text-3xl font-bold text-center text-white tracking-tight">{headerTitle}</h1>
            </div>
          </div>
          <div className="divide-y divide-gray-700/30">
            {bets.map((bet) => (
              <div
                key={bet.id}
                className={`p-6 flex items-center gap-4 ${
                  bet.status === 'green'
                    ? 'bg-green-900/10'
                    : bet.status === 'red'
                    ? 'bg-red-900/10'
                    : ''
                }`}
              >
                <div className="flex-1 min-w-0 mr-6">
                  {editingId === bet.id ? (
                    <div className="space-y-3">
                      {bet.type === 'single' ? (
                        <>
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                            autoFocus
                          />
                          <div className="flex gap-4">
                            <input
                              type="text"
                              inputMode="decimal"
                              value={editOdds}
                              onChange={(e) => handleNumberChange(e.target.value, setEditOdds)}
                              placeholder="Enter odds..."
                              className="flex-1 p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                            />
                            <div className="flex-1">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={editBalance}
                                  onChange={(e) => handleNumberChange(e.target.value, setEditBalance)}
                                  placeholder={editBalanceType === 'units' ? "Enter units..." : "Enter amount..."}
                                  className="flex-1 p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                                  className="px-3 rounded-lg bg-gray-800/50 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
                                >
                                  {editBalanceType === 'units' ? 'Units' : 'Money'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-4">
                          {editingMultipleTips.map((tip, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={tip.tip}
                                  onChange={(e) => updateMultipleTip(index, 'tip', e.target.value, true)}
                                  placeholder={`Tip ${index + 1}`}
                                  className="w-full p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                                />
                              </div>
                              <div className="w-32">
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={tip.odds}
                                  onChange={(e) => updateMultipleTip(index, 'odds', e.target.value, true)}
                                  placeholder="Odds"
                                  className="w-full p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                                />
                              </div>
                              {editingMultipleTips.length > 2 && (
                                <button
                                  type="button"
                                  onClick={() => removeTip(index, true)}
                                  className="p-2 rounded-lg hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/30"
                                >
                                  <X size={18} />
                                </button>
                              )}
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addTip(true)}
                            className="w-full py-3 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/30 flex items-center justify-center">
                            <Plus size={20} />
                          </button>
                          {editingMultipleTips.length > 1 && (
                            <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
                              <div className="flex items-center justify-between">
                                <p className="text-gray-400">Total Odds: <span className="text-white font-medium">{calculateTotalOdds(editingMultipleTips)}</span></p>
                              </div>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  inputMode="decimal"
                                  value={editBalance}
                                  onChange={(e) => handleNumberChange(e.target.value, setEditBalance)}
                                  placeholder={editBalanceType === 'units' ? "Enter units..." : "Enter amount..."}
                                  className="flex-1 p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                                  className="px-3 rounded-lg bg-gray-800/50 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
                                >
                                  {editBalanceType === 'units' ? 'Units' : 'Money'}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {bet.type === 'single' ? (
                        <>
                          <p className="font-medium text-white text-lg tracking-tight truncate">{bet.tip}</p>
                          <div className="flex items-center gap-4 mt-2">
                            {bet.odds && (
                              <span className="text-sm font-medium px-2 py-1 rounded-lg bg-gray-800/50 text-gray-300">
                                {bet.odds}
                              </span>
                            )}
                            {bet.balance && (
                              <span className="text-sm font-medium px-2 py-1 rounded-lg bg-gray-800/50 text-gray-300">
                                {bet.balance} {bet.balanceType === 'units' ? 'units' : '$'}
                              </span>
                            )}
                            <span className="text-sm text-gray-400 tracking-wide">{bet.timestamp}</span>
                            {isStreamMode && bet.status !== 'pending' && (
                              <span className={`text-sm font-medium px-3 py-1 rounded-lg ${
                                bet.status === 'green'
                                  ? 'bg-green-900/20 text-green-400 border border-green-500/20'
                                  : 'bg-red-900/20 text-red-400 border border-red-500/20'
                              }`}>
                                {bet.status.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            {bet.tips.map((tip, index) => (
                              <div key={index} className="flex items-center gap-4">
                                <p className="font-medium text-white text-lg tracking-tight truncate">{tip.tip}</p>
                                <span className="text-sm font-medium px-2 py-1 rounded-lg bg-gray-800/50 text-gray-300">
                                  {tip.odds}
                                </span>
                              </div>
                            ))}
                            <div className="flex items-center gap-4 mt-3">
                              <div className="flex items-center gap-4">
                                <span className="text-sm font-medium px-2 py-1 rounded-lg bg-blue-900/20 text-blue-300 border border-blue-500/20">
                                  Total: {bet.totalOdds}
                                </span>
                                {bet.balance && (
                                  <span className="text-sm font-medium px-2 py-1 rounded-lg bg-gray-800/50 text-gray-300">
                                    {bet.balance} {bet.balanceType === 'units' ? 'units' : '$'}
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-400 tracking-wide">{bet.timestamp}</span>
                              {isStreamMode && bet.status !== 'pending' && (
                                <span className={`text-sm font-medium px-3 py-1 rounded-lg ${
                                  bet.status === 'green'
                                    ? 'bg-green-900/20 text-green-400 border border-green-500/20'
                                    : 'bg-red-900/20 text-red-400 border border-red-500/20'
                                }`}>
                                  {bet.status.toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
                {!isStreamMode && (
                  <div className="flex items-center gap-3 shrink-0">
                    {editingId === bet.id ? (
                      <>
                        <button
                          onClick={saveEdit}
                          className="p-3 rounded-xl hover:bg-green-600/20 text-green-500 hover:text-green-400 transition-all duration-300 border border-green-500/20 hover:border-green-500/30"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-3 rounded-xl hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/30"
                        >
                          <X size={20} />
                        </button>
                      </>
                    ) : (
                      <>
                        {bet.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => updateBetStatus(bet.id, 'green')}
                              className="p-3 rounded-xl hover:bg-green-600/20 text-green-500 hover:text-green-400 transition-all duration-300 border border-green-500/20 hover:border-green-500/30"
                            >
                              <Check size={20} />
                            </button>
                            <button
                              onClick={() => updateBetStatus(bet.id, 'red')}
                              className="p-3 rounded-xl hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/30"
                            >
                              <X size={20} />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => updateBetStatus(bet.id, bet.status)}
                            className={`h-[44px] flex items-center text-sm font-semibold px-4 rounded-xl mr-3 cursor-pointer transition-all duration-300 ${
                              bet.status === 'green' 
                                ? 'text-green-400 bg-green-900/20 border border-green-500/20 hover:bg-green-900/30' 
                                : 'text-red-400 bg-red-900/20 border border-red-500/20 hover:bg-red-900/30'
                            }`}
                          >
                            {bet.status.toUpperCase()}
                          </button>
                        )}
                        <button
                          onClick={() => startEdit(bet)}
                          className="p-3 rounded-xl hover:bg-blue-600/20 text-blue-500 hover:text-blue-400 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/30"
                        >
                          <Pencil size={20} />
                        </button>
                        <button
                          onClick={() => deleteBet(bet.id)}
                          className="p-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/30"
                        >
                          <Trash2 size={20} />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
            {bets.length === 0 && (
              <div className="p-10 text-center text-gray-400">
                <p className="text-lg">No betting tips yet</p>
                <p className="text-sm mt-2">Click the + button to add one!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;