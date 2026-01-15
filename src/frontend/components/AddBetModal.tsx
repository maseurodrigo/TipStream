import React from 'react';
import { X, Plus } from 'lucide-react';
import { BettingSite } from '../utils/types';
import { UseBetFormReturn } from '../hooks/useBetForm';
import { calculateTotalOdds } from '../utils/helpers';

interface AddBetModalProps {
  isOpen: boolean;
  onClose: () => void;
  formState: UseBetFormReturn;
  onSubmit: (e: React.FormEvent) => void;
  bettingSites: BettingSite[];
  baseColor: string;
}

export const AddBetModal: React.FC<AddBetModalProps> = ({
  isOpen,
  onClose,
  formState,
  onSubmit,
  bettingSites,
  baseColor,
}) => {
  if (!isOpen) return null;

  const {
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
    addTip,
    removeTip,
    updateMultipleTip,
    handleOddsChange,
    handleBalanceChange,
  } = formState;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center pointer-events-auto z-50">
      <div
        className="bg-gray-900/95 p-8 rounded-3xl w-full max-w-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] transform transition-all duration-300 border border-gray-700/30"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-white tracking-tight">Add New Bet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700/50 rounded-xl"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
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
                  placeholder="Betting tip..."
                  className="w-full p-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300 text-lg"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={newTeams}
                  onChange={(e) => setNewTeams(e.target.value)}
                  placeholder="Teams (e.g., Team A vs Team B)..."
                  className="w-full p-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300 text-lg"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={newOdds}
                    onChange={(e) => handleOddsChange(e.target.value)}
                    placeholder="Odds (e.g., 1.75)..."
                    className="w-full p-4 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300 text-lg"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={newBalance}
                      onChange={(e) => handleBalanceChange(e.target.value)}
                      placeholder={newBalanceType === 'units' ? "Units..." : "Amount..."}
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
              <div>
                <select
                  value={newSite}
                  onChange={e => setNewSite(e.target.value)}
                  className="w-full p-4 rounded-xl bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 appearance-none transition-all duration-300"
                >
                  {bettingSites.map(site => (
                    <option key={site.value} value={site.value} style={{ backgroundColor: "rgba(31, 41, 55, 0.8)", color: "#fff" }}>{site.label}</option>
                  ))}
                </select>
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
                      className="w-full p-3 rounded-xl bg-gray-800/50 text-white placeholder-gray-400 border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300 mb-2"
                    />
                    <input
                      type="text"
                      value={tip.teams}
                      onChange={(e) => updateMultipleTip(index, 'teams', e.target.value)}
                      placeholder={`Teams (e.g., Team A vs Team B)`}
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
                      onChange={(e) => handleBalanceChange(e.target.value)}
                      placeholder={newBalanceType === 'units' ? "Units..." : "Amount..."}
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
                  <div>
                    <select
                      value={newSite}
                      onChange={e => setNewSite(e.target.value)}
                      className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 appearance-none transition-all duration-300"
                    >
                      {bettingSites.map(site => (
                        <option key={site.value} value={site.value} style={{ backgroundColor: "rgba(31, 41, 55, 0.8)", color: "#fff" }}>{site.label}</option>
                      ))}
                    </select>
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
  );
};
