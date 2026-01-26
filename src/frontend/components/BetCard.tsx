import { motion } from "framer-motion";
import { Check, X, Pencil, Trash2, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Bet, BettingSite } from '../utils/types';
import { calculateTotalOdds } from '../utils/helpers';

interface BetCardProps {
  bet: Bet;
  bettingSites: BettingSite[];
  isEditing: boolean;
  isStreamMode: boolean;
  editState?: {
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
    editingMultipleTips: { tip: string; odds: string; teams: string }[];
    handleEditOddsChange: (value: string) => void;
    handleEditBalanceChange: (value: string) => void;
    updateEditMultipleTip: (index: number, field: 'tip' | 'odds' | 'teams', value: string) => void;
    addEditTip: () => void;
    removeEditTip: (index: number) => void;
  };
  onEdit?: (bet: Bet) => void;
  onSaveEdit?: () => void;
  onCancelEdit?: () => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: 'green' | 'red') => void;
}

export const BetCard: React.FC<BetCardProps> = ({
  bet,
  bettingSites,
  isEditing,
  isStreamMode,
  editState,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onStatusChange,
}) => {
  const [showGlow, setShowGlow] = useState(false);
  const [glowColor, setGlowColor] = useState<'green' | 'red' | null>(null);
  const prevStatusRef = useRef(bet.status);

  // Detect status changes and trigger glow effect
  useEffect(() => {
    if (isStreamMode && prevStatusRef.current !== bet.status && bet.status !== 'pending') {
      // Status changed to green or red
      setGlowColor(bet.status);
      setShowGlow(true);

      // Reset glow after animation completes
      const timer = setTimeout(() => {
        setShowGlow(false);
      }, 1200); // Match animation duration

      return () => clearTimeout(timer);
    }
    prevStatusRef.current = bet.status;
  }, [bet.status, isStreamMode]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gray-900/80 p-4 rounded-lg shadow-lg flex items-center gap-3 relative overflow-hidden"
    >
      {/* Diagonal glow effect overlay */}
      {showGlow && glowColor && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          initial={{ x: '-150%', y: '-150%' }}
          animate={{ x: '150%', y: '150%' }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
          style={{
            background: glowColor === 'green'
              ? 'linear-gradient(135deg, transparent 0%, transparent 30%, rgba(34, 197, 94, 0.6) 50%, rgba(74, 222, 128, 0.4) 60%, transparent 80%, transparent 100%)'
              : 'linear-gradient(135deg, transparent 0%, transparent 30%, rgba(239, 68, 68, 0.6) 50%, rgba(248, 113, 113, 0.4) 60%, transparent 80%, transparent 100%)',
            width: '150%',
            height: '150%',
            filter: 'blur(8px)',
          }}
        />
      )}
      {/* Secondary glow for enhanced effect */}
      {showGlow && glowColor && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.2, times: [0, 0.2, 0.8, 1] }}
          style={{
            boxShadow: glowColor === 'green'
              ? '0 0 40px rgba(34, 197, 94, 0.6), inset 0 0 20px rgba(34, 197, 94, 0.2)'
              : '0 0 40px rgba(239, 68, 68, 0.6), inset 0 0 20px rgba(239, 68, 68, 0.2)',
          }}
        />
      )}
      <div className="flex-1 min-w-0 mr-4 relative z-10">
        {isEditing && editState ? (
          <div className="space-y-3">
            {bet.type === 'single' ? (
              <>
                <input
                  type="text"
                  value={editState.editText}
                  onChange={(e) => editState.setEditText(e.target.value)}
                  className="w-full p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                  autoFocus
                />
                <input
                  type="text"
                  value={editState.editTeams}
                  onChange={(e) => editState.setEditTeams(e.target.value)}
                  placeholder="Teams (e.g., Team A vs Team B)..."
                  className="w-full p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                />
                <div className="flex gap-4">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={editState.editOdds}
                    onChange={(e) => editState.handleEditOddsChange(e.target.value)}
                    placeholder="Odds..."
                    className="flex-1 p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                  />
                  <div className="flex-1">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={editState.editBalance}
                        onChange={(e) => editState.handleEditBalanceChange(e.target.value)}
                        placeholder={editState.editBalanceType === 'units' ? "Units..." : "Amount..."}
                        className="flex-1 p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => editState.setEditBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                        className="px-3 rounded-lg bg-gray-800/50 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
                      >
                        {editState.editBalanceType === 'units' ? 'Units' : 'Money'}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <select
                    value={editState.editSite}
                    onChange={e => editState.setEditSite(e.target.value)}
                    className="w-full p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 appearance-none transition-all duration-300"
                  >
                    {bettingSites.map(site => (
                      <option key={site.value} value={site.value} style={{ backgroundColor: "rgba(31, 41, 55, 0.8)", color: "#fff" }}>{site.label}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                {editState.editingMultipleTips.map((tip, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={tip.tip}
                        onChange={(e) => editState.updateEditMultipleTip(index, 'tip', e.target.value)}
                        placeholder={`Tip ${index + 1}`}
                        className="w-full p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300 mb-2"
                      />
                      <input
                        type="text"
                        value={tip.teams}
                        onChange={(e) => editState.updateEditMultipleTip(index, 'teams', e.target.value)}
                        placeholder={`Teams (e.g., Team A vs Team B)`}
                        className="w-full p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={tip.odds}
                        onChange={(e) => editState.updateEditMultipleTip(index, 'odds', e.target.value)}
                        placeholder="Odds"
                        className="w-full p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                      />
                    </div>
                    {editState.editingMultipleTips.length > 2 && (
                      <button
                        type="button"
                        onClick={() => editState.removeEditTip(index)}
                        className="p-2 rounded-lg hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/30"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => editState.addEditTip()}
                  className="w-full py-3 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/30 flex items-center justify-center"
                >
                  <Plus size={20} />
                </button>
                {editState.editingMultipleTips.length > 1 && (
                  <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400">Total Odds: <span className="text-white font-medium">{calculateTotalOdds(editState.editingMultipleTips)}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={editState.editBalance}
                        onChange={(e) => editState.handleEditBalanceChange(e.target.value)}
                        placeholder={editState.editBalanceType === 'units' ? "Units..." : "Amount..."}
                        className="flex-1 p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 focus:ring-2 focus:ring-gray-500 transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => editState.setEditBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                        className="px-3 rounded-lg bg-gray-800/50 text-blue-400 hover:text-blue-300 border border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all duration-300"
                      >
                        {editState.editBalanceType === 'units' ? 'Units' : 'Money'}
                      </button>
                    </div>
                    <div>
                      <select
                        value={editState.editSite}
                        onChange={e => editState.setEditSite(e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-800/50 text-white border border-gray-600/50 focus:border-gray-500 appearance-none transition-all duration-300"
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
          </div>
        ) : (
          <>
            {bet.type === 'single' ? (
              <>
                <p className="font-semibold text-blue-300 text-sm mb-0.5 truncate">{bet.teams}</p>
                <p className="font-medium text-white text-base tracking-tight truncate">{bet.tip}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  {bet.odds && (
                    <span className="flex text-sm font-medium px-2 py-1 rounded-lg shadow-lg bg-gray-800/80 text-gray-300">
                      <img
                        src={bettingSites.find(site => site.value === bet.site)?.logo}
                        alt={bet.site}
                        className="w-[20px] h-[20px] mr-2 rounded shadow-md"
                        style={{ objectFit: 'cover', background: 'transparent' }}
                      />
                      {bet.odds}
                    </span>
                  )}
                  {bet.balance && (
                    <span className="flex text-sm font-medium px-2 py-1 rounded-lg shadow-lg bg-gray-800/80 text-gray-300">
                      {bet.balanceType === 'units' ?
                        <svg className="w-[18px] h-[18px] mr-2 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z"/>
                        </svg>
                        :
                        <svg className="w-[18px] h-[18px] mr-2 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
                        </svg>
                      }
                      {bet.balance}
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
                <div className="space-y-1.5">
                  {bet.tips.map((tip, index) => (
                    <div key={index} className="flex flex-col gap-0.5">
                      <span className="text-blue-300 text-xs font-semibold">{tip.teams}</span>
                      <div className="flex items-center gap-3">
                        <p className="font-medium text-white text-base tracking-tight truncate">{tip.tip}</p>
                        <span className="text-sm font-medium px-2 py-1 rounded-lg shadow-md bg-gray-800/80 text-gray-300">
                          {tip.odds}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-3">
                      <span className="flex text-sm font-medium px-2 py-1 rounded-lg shadow-lg bg-blue-900/20 text-blue-300 border border-blue-500/20">
                        <img
                          src={bettingSites.find(site => site.value === bet.site)?.logo}
                          alt={bet.site}
                          className="w-[20px] h-[20px] mr-2 rounded shadow-md"
                          style={{ objectFit: 'cover', background: 'transparent' }}
                        />
                        Total: {bet.totalOdds}
                      </span>
                      {bet.balance && (
                        <span className="flex text-sm font-medium px-2 py-1 rounded-lg shadow-lg bg-gray-800/80 text-gray-300">
                          {bet.balanceType === 'units' ?
                            <svg className="w-[18px] h-[18px] mr-2 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z"/>
                            </svg>
                            :
                            <svg className="w-[18px] h-[18px] mr-2 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
                            </svg>
                          }
                          {bet.balance}
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
        <div className="flex items-center gap-2 shrink-0 relative z-10">
          {isEditing ? (
            <>
              <button
                onClick={onSaveEdit}
                className="p-2.5 rounded-xl hover:bg-green-600/20 text-green-500 hover:text-green-400 transition-all duration-300 border border-green-500/20 hover:border-green-500/30"
              >
                <Check size={18} />
              </button>
              <button
                onClick={onCancelEdit}
                className="p-2.5 rounded-xl hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/30"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <>
              {bet.status === 'pending' ? (
                <>
                  <button
                    onClick={() => onStatusChange?.(bet.id, 'green')}
                    className="p-2.5 rounded-xl hover:bg-green-600/20 text-green-500 hover:text-green-400 transition-all duration-300 border border-green-500/20 hover:border-green-500/30"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => onStatusChange?.(bet.id, 'red')}
                    className="p-2.5 rounded-xl hover:bg-red-600/20 text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/30"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onStatusChange?.(bet.id, bet.status === 'green' ? 'green' : 'red')}
                  className={`h-[38px] flex items-center text-xs font-semibold px-3 rounded-xl shadow-md mr-2 cursor-pointer transition-all duration-300 ${
                    bet.status === 'green'
                      ? 'text-green-400 bg-green-900/20 border border-green-500/20 hover:bg-green-900/30'
                      : 'text-red-400 bg-red-900/20 border border-red-500/20 hover:bg-red-900/30'
                  }`}
                >
                  {bet.status.toUpperCase()}
                </button>
              )}
              <button
                onClick={() => onEdit?.(bet)}
                className="p-2.5 rounded-xl hover:bg-blue-600/20 text-blue-500 hover:text-blue-400 transition-all duration-300 border border-blue-500/20 hover:border-blue-500/30"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onDelete?.(bet.id)}
                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 transition-all duration-300 border border-red-500/20 hover:border-red-500/30"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      )}
    </motion.div>
  );
};
