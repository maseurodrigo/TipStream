import { motion } from "framer-motion";
import { Check, X, Pencil, Trash2, Plus } from 'lucide-react';
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
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 px-4 py-3.5 rounded-xl shadow-xl border border-gray-700/40 hover:border-gray-600/60 flex items-center gap-3 transition-all duration-300"
    >
      <div className="flex-1 min-w-0 mr-4">
        {isEditing && editState ? (
          <div className="space-y-3">
            {bet.type === 'single' ? (
              <>
                <input
                  type="text"
                  value={editState.editText}
                  onChange={(e) => editState.setEditText(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800/70 text-white border border-gray-600/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-500"
                  placeholder="Enter your betting tip..."
                  autoFocus
                />
                <input
                  type="text"
                  value={editState.editTeams}
                  onChange={(e) => editState.setEditTeams(e.target.value)}
                  placeholder="Teams (e.g., Team A vs Team B)..."
                  className="w-full px-3 py-2.5 rounded-lg bg-gray-800/70 text-white border border-gray-600/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-500"
                />
                <div className="flex flex-wrap gap-3">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={editState.editOdds}
                    onChange={(e) => editState.handleEditOddsChange(e.target.value)}
                    placeholder="Odds..."
                    className="flex-1 min-w-[140px] px-3 py-2.5 rounded-lg bg-gray-800/70 text-white border border-gray-600/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-500"
                  />
                  <div className="flex flex-1 min-w-[200px] gap-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={editState.editBalance}
                      onChange={(e) => editState.handleEditBalanceChange(e.target.value)}
                      placeholder={editState.editBalanceType === 'units' ? "Units..." : "Amount..."}
                      className="flex-1 min-w-0 px-3 py-2.5 rounded-lg bg-gray-800/70 text-white border border-gray-600/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => editState.setEditBalanceType(editState.editBalanceType === 'units' ? 'money' : 'units')}
                      className="p-2.5 rounded-lg bg-gray-800/70 text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-200 shadow-sm"
                      title={editState.editBalanceType === 'units' ? 'Switch to Money' : 'Switch to Units'}
                    >
                      {editState.editBalanceType === 'units' ? (
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z"/>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <select
                    value={editState.editSite}
                    onChange={e => editState.setEditSite(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-gray-800/70 text-white border border-gray-600/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 appearance-none transition-all duration-200 cursor-pointer"
                  >
                    {bettingSites.map(site => (
                      <option key={site.value} value={site.value} style={{ backgroundColor: "rgba(31, 41, 55, 0.9)", color: "#fff" }}>{site.label}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <div className="space-y-3.5">
                {editState.editingMultipleTips.map((tip, index) => (
                  <div key={index} className="flex gap-3 items-start">
                    <div className="flex-1 space-y-2.5">
                      <input
                        type="text"
                        value={tip.tip}
                        onChange={(e) => editState.updateEditMultipleTip(index, 'tip', e.target.value)}
                        placeholder={`Tip ${index + 1}`}
                        className="w-full px-3 py-2.5 rounded-lg bg-gray-800/70 text-white border border-gray-600/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-500"
                      />
                      <input
                        type="text"
                        value={tip.teams}
                        onChange={(e) => editState.updateEditMultipleTip(index, 'teams', e.target.value)}
                        placeholder="Teams (e.g., Team A vs Team B)"
                        className="w-full px-3 py-2.5 rounded-lg bg-gray-800/70 text-white border border-gray-600/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-500"
                      />
                    </div>
                    <div className="w-28">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={tip.odds}
                        onChange={(e) => editState.updateEditMultipleTip(index, 'odds', e.target.value)}
                        placeholder="Odds"
                        className="w-full px-3 py-2.5 rounded-lg bg-gray-800/70 text-white border border-gray-600/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-500"
                      />
                    </div>
                    {editState.editingMultipleTips.length > 1 && (
                      <button
                        type="button"
                        onClick={() => editState.removeEditTip(index)}
                        className="p-2.5 mt-0.5 rounded-lg hover:bg-red-500/15 text-red-400 hover:text-red-300 transition-all duration-200 border border-red-500/30 hover:border-red-500/50"
                        title="Remove this tip"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => editState.addEditTip()}
                  className="w-full py-2.5 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-200 border-2 border-dashed border-blue-500/30 hover:border-blue-500/50 flex items-center justify-center gap-2 font-medium"
                >
                  <Plus size={18} />
                  <span>Add Tip</span>
                </button>
                {editState.editingMultipleTips.length > 1 && (
                  <div className="mt-3 p-4 rounded-lg bg-gray-800/40 border border-gray-700/50 space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400 font-medium">Total Odds:</span>
                      <span className="text-base text-white font-semibold">{calculateTotalOdds(editState.editingMultipleTips)}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        inputMode="decimal"
                        value={editState.editBalance}
                        onChange={(e) => editState.handleEditBalanceChange(e.target.value)}
                        placeholder={editState.editBalanceType === 'units' ? "Units..." : "Amount..."}
                        className="flex-1 min-w-[140px] px-3 py-2.5 rounded-lg bg-gray-800/70 text-white border border-gray-600/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder:text-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => editState.setEditBalanceType(editState.editBalanceType === 'units' ? 'money' : 'units')}
                        className="p-2.5 rounded-lg bg-gray-800/70 text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-200 shadow-sm"
                        title={editState.editBalanceType === 'units' ? 'Switch to Money' : 'Switch to Units'}
                      >
                        {editState.editBalanceType === 'units' ? (
                          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z"/>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    <div>
                      <select
                        value={editState.editSite}
                        onChange={e => editState.setEditSite(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg bg-gray-800/70 text-white border border-gray-600/60 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 appearance-none transition-all duration-200 cursor-pointer"
                      >
                        {bettingSites.map(site => (
                          <option key={site.value} value={site.value} style={{ backgroundColor: "rgba(31, 41, 55, 0.9)", color: "#fff" }}>{site.label}</option>
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
                <p className="font-semibold text-blue-400 text-sm mb-1 truncate tracking-wide">{bet.teams}</p>
                <p className="font-semibold text-white text-[17px] leading-tight truncate">{bet.tip}</p>
                <div className="flex flex-wrap items-center gap-2.5 mt-2">
                  {bet.odds && (
                    <span className="inline-flex items-center text-sm font-semibold px-3 py-1.5 rounded-lg shadow-md bg-gray-800/90 text-gray-100 border border-gray-700/50">
                      <img
                        src={bettingSites.find(site => site.value === bet.site)?.logo}
                        alt={bet.site}
                        className="w-[18px] h-[18px] mr-2 rounded shadow-sm"
                        style={{ objectFit: 'cover', background: 'transparent' }}
                      />
                      {bet.odds}
                    </span>
                  )}
                  {bet.balance && (
                    <span className="inline-flex items-center text-sm font-semibold px-3 py-1.5 rounded-lg shadow-md bg-gray-800/90 text-gray-100 border border-gray-700/50">
                      {bet.balanceType === 'units' ?
                        <svg className="w-[17px] h-[17px] mr-1.5 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z"/>
                        </svg>
                        :
                        <svg className="w-[17px] h-[17px] mr-1.5 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
                        </svg>
                      }
                      {bet.balance}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 font-medium tracking-wide">{bet.timestamp}</span>
                  {isStreamMode && bet.status !== 'pending' && (
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider ${
                      bet.status === 'green'
                        ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}>
                      {bet.status}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  {bet.tips.map((tip, index) => (
                    <div key={index} className="flex flex-col gap-1">
                      <span className="text-blue-400 text-xs font-semibold tracking-wide">{tip.teams}</span>
                      <div className="flex items-center gap-2.5">
                        <p className="font-semibold text-white text-[15px] leading-tight truncate">{tip.tip}</p>
                        <span className="text-sm font-semibold px-2.5 py-1 rounded-lg shadow-md bg-gray-800/90 text-gray-100 border border-gray-700/50">
                          {tip.odds}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-wrap items-center gap-2.5 mt-2.5 pt-2 border-t border-gray-700/30">
                    <span className="inline-flex items-center text-sm font-semibold px-3 py-1.5 rounded-lg shadow-md bg-blue-500/15 text-blue-300 border border-blue-500/40">
                      <img
                        src={bettingSites.find(site => site.value === bet.site)?.logo}
                        alt={bet.site}
                        className="w-[18px] h-[18px] mr-2 rounded shadow-sm"
                        style={{ objectFit: 'cover', background: 'transparent' }}
                      />
                      Total: {bet.totalOdds}
                    </span>
                    {bet.balance && (
                      <span className="inline-flex items-center text-sm font-semibold px-3 py-1.5 rounded-lg shadow-md bg-gray-800/90 text-gray-100 border border-gray-700/50">
                        {bet.balanceType === 'units' ?
                          <svg className="w-[17px] h-[17px] mr-1.5 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z"/>
                          </svg>
                          :
                          <svg className="w-[17px] h-[17px] mr-1.5 text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
                          </svg>
                        }
                        {bet.balance}
                      </span>
                    )}
                    <span className="text-xs text-gray-400 font-medium tracking-wide">{bet.timestamp}</span>
                    {isStreamMode && bet.status !== 'pending' && (
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-md uppercase tracking-wider ${
                        bet.status === 'green'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                          : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}>
                        {bet.status}
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
        <div className="flex items-center gap-2 shrink-0">
          {isEditing ? (
            <>
              <button
                onClick={onSaveEdit}
                className="p-2.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 transition-all duration-200 border border-green-500/30 hover:border-green-500/50 shadow-sm"
                title="Save changes"
              >
                <Check size={18} />
              </button>
              <button
                onClick={onCancelEdit}
                className="p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 border border-red-500/30 hover:border-red-500/50 shadow-sm"
                title="Cancel editing"
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
                    className="p-2.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 transition-all duration-200 border border-green-500/30 hover:border-green-500/50 shadow-sm"
                    title="Mark as won"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => onStatusChange?.(bet.id, 'red')}
                    className="p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 border border-red-500/30 hover:border-red-500/50 shadow-sm"
                    title="Mark as lost"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onStatusChange?.(bet.id, bet.status === 'green' ? 'green' : 'red')}
                  className={`h-[38px] flex items-center text-xs font-bold px-3 rounded-lg shadow-md mr-1.5 cursor-pointer transition-all duration-200 uppercase tracking-wide ${
                    bet.status === 'green'
                      ? 'text-green-400 bg-green-500/15 border border-green-500/40 hover:bg-green-500/25 hover:border-green-500/50'
                      : 'text-red-400 bg-red-500/15 border border-red-500/40 hover:bg-red-500/25 hover:border-red-500/50'
                  }`}
                  title="Click to change status"
                >
                  {bet.status}
                </button>
              )}
              <button
                onClick={() => onEdit?.(bet)}
                className="p-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50 shadow-sm"
                title="Edit bet"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onDelete?.(bet.id)}
                className="p-2.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200 border border-red-500/30 hover:border-red-500/50 shadow-sm"
                title="Delete bet"
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
