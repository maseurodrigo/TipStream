import { motion } from "framer-motion";
import { Check, X, Pencil, Trash2, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Input, Select, Option } from "@material-tailwind/react";
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
      className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-lg py-3.5 px-4 rounded-2xl shadow-xl border border-gray-700/50 hover:border-gray-600/50 flex items-center gap-2.5 relative overflow-hidden transition-all duration-300 hover:shadow-2xl"
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
          <div className="space-y-2.5">
            {bet.type === 'single' ? (
              <>
                <Input
                  type="text"
                  value={editState.editText}
                  onChange={(e) => editState.setEditText(e.target.value)}
                  label="Betting tip"
                  variant="outlined"
                  color="blue"
                  className="text-white"
                  containerProps={{ className: "min-w-0" }}
                  labelProps={{
                    className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                  }}
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <Input
                  type="text"
                  value={editState.editTeams}
                  onChange={(e) => editState.setEditTeams(e.target.value)}
                  label="Teams"
                  variant="outlined"
                  color="blue"
                  className="text-white"
                  containerProps={{ className: "min-w-0" }}
                  labelProps={{
                    className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                  }}
                  crossOrigin={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <div className="flex gap-4 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={editState.editOdds}
                      onChange={(e) => editState.handleEditOddsChange(e.target.value)}
                      label="Odds"
                      variant="outlined"
                      color="blue"
                      className="text-white"
                      containerProps={{ className: "min-w-0" }}
                      labelProps={{
                        className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                      }}
                      crossOrigin={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={editState.editBalance}
                        onChange={(e) => editState.handleEditBalanceChange(e.target.value)}
                        label={editState.editBalanceType === 'units' ? "Units" : "Amount"}
                        variant="outlined"
                        color="blue"
                        className="text-white"
                        containerProps={{ className: "min-w-0" }}
                        labelProps={{
                          className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                        }}
                        crossOrigin={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                      <button
                        type="button"
                        onClick={() => editState.setEditBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                        className="px-3.5 rounded-lg bg-gray-800/60 text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:bg-blue-500/15 hover:border-blue-400/50 transition-all duration-200 shadow-sm hover:shadow-md"
                        title={editState.editBalanceType === 'units' ? 'Switch to Money' : 'Switch to Units'}
                      >
                        {editState.editBalanceType === 'units' ? (
                          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z"/>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <Select
                    value={editState.editSite}
                    onChange={(val) => editState.setEditSite(val as string)}
                    label="Betting Site"
                    variant="outlined"
                    color="blue"
                    className="text-white"
                    containerProps={{ className: "min-w-0" }}
                    labelProps={{
                      className: "!text-gray-400 peer-focus:!text-blue-400"
                    }}
                    menuProps={{
                      className: "bg-gray-800 border border-gray-700 max-h-40 overflow-y-auto"
                    }}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {bettingSites.map(site => (
                      <Option key={site.value} value={site.value} className="text-white hover:bg-gray-700">
                        {site.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                {editState.editingMultipleTips.map((tip, index) => (
                  <div key={index} className="flex gap-2 items-stretch w-full">
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-2 flex-wrap">
                        <div className="flex-[2] min-w-[200px] space-y-2">
                          <Input
                            type="text"
                            value={tip.tip}
                            onChange={(e) => editState.updateEditMultipleTip(index, 'tip', e.target.value)}
                            label={`Tip ${index + 1}`}
                            variant="outlined"
                            color="blue"
                            className="text-white"
                            containerProps={{ className: "min-w-0" }}
                            labelProps={{
                              className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                            }}
                            crossOrigin={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          />
                          <Input
                            type="text"
                            value={tip.teams}
                            onChange={(e) => editState.updateEditMultipleTip(index, 'teams', e.target.value)}
                            label="Teams"
                            variant="outlined"
                            color="blue"
                            className="text-white"
                            containerProps={{ className: "min-w-0" }}
                            labelProps={{
                              className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                            }}
                            crossOrigin={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          />
                        </div>
                        <div className="flex-1 min-w-[120px] self-start pt-1">
                          <Input
                            type="text"
                            inputMode="decimal"
                            value={tip.odds}
                            onChange={(e) => editState.updateEditMultipleTip(index, 'odds', e.target.value)}
                            label="Odds"
                            variant="outlined"
                            color="blue"
                            className="text-white"
                            containerProps={{ className: "min-w-0" }}
                            labelProps={{
                              className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                            }}
                            crossOrigin={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          />
                        </div>
                      </div>
                    </div>
                    {editState.editingMultipleTips.length > 1 && (
                      <div className="flex-shrink-0 flex">
                        <button
                          type="button"
                          onClick={() => editState.removeEditTip(index)}
                          className="h-full px-2.5 py-2.5 rounded-xl bg-gradient-to-br from-red-900/20 to-red-800/20 hover:from-red-600/30 hover:to-red-500/30 text-red-500 hover:text-red-400 transition-all duration-200 border border-red-500/30 hover:border-red-500/50 backdrop-blur-lg flex items-center justify-center shadow-sm hover:shadow-md group"
                          title="Remove this tip"
                        >
                          <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => editState.addEditTip()}
                  className="w-full py-2.5 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-blue-500/15 transition-all duration-200 border-2 border-dashed border-blue-500/30 hover:border-blue-400/50 backdrop-blur-lg flex items-center justify-center gap-2 font-semibold shadow-sm hover:shadow-md group"
                >
                  <Plus size={20} className="group-hover:rotate-90 transition-transform duration-200" />
                </button>
                {editState.editingMultipleTips.length > 1 && (
                  <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-gray-800/40 to-gray-800/20 border border-blue-500/30 backdrop-blur-lg shadow-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-400">Total Odds: <span className="text-white font-medium">{calculateTotalOdds(editState.editingMultipleTips)}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={editState.editBalance}
                        onChange={(e) => editState.handleEditBalanceChange(e.target.value)}
                        label={editState.editBalanceType === 'units' ? "Units" : "Amount"}
                        variant="outlined"
                        color="blue"
                        className="text-white"
                        containerProps={{ className: "min-w-0" }}
                        labelProps={{
                          className: "!text-gray-400 peer-focus:!text-blue-400 peer-placeholder-shown:!text-gray-400"
                        }}
                        crossOrigin={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      />
                      <button
                        type="button"
                        onClick={() => editState.setEditBalanceType(prev => prev === 'units' ? 'money' : 'units')}
                        className="px-3.5 rounded-lg bg-gray-800/60 text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:bg-blue-500/15 hover:border-blue-400/50 transition-all duration-200 shadow-sm hover:shadow-md"
                        title={editState.editBalanceType === 'units' ? 'Switch to Money' : 'Switch to Units'}
                      >
                        {editState.editBalanceType === 'units' ? (
                          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5.5 21h13M12 21V7m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm2-1.8c3.073.661 2.467 2.8 5 2.8M5 8c3.359 0 2.192-2.115 5.012-2.793M7 9.556V7.75m0 1.806-1.95 4.393a.773.773 0 0 0 .37.962.785.785 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.776.776 0 0 0 .09-.716L7 9.556Zm10 0V7.313m0 2.243-1.95 4.393a.773.773 0 0 0 .37.962.786.786 0 0 0 .362.089h2.436a.785.785 0 0 0 .643-.335.775.775 0 0 0 .09-.716L17 9.556Z"/>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    <div>
                      <Select
                        value={editState.editSite}
                        onChange={(val) => editState.setEditSite(val as string)}
                        label="Betting Site"
                        variant="outlined"
                        color="blue"
                        className="text-white"
                        containerProps={{ className: "min-w-0" }}
                        labelProps={{
                          className: "!text-gray-400 peer-focus:!text-blue-400"
                        }}
                        menuProps={{
                          className: "bg-gray-800 border border-gray-700 max-h-60 overflow-y-auto mt-2"
                        }}
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        {bettingSites.map(site => (
                          <Option key={site.value} value={site.value} className="text-white hover:bg-gray-700">
                            {site.label}
                          </Option>
                        ))}
                      </Select>
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
                <div className="flex items-center gap-2.5 mt-1">
                  {bet.odds && (
                    <span className="flex text-sm font-semibold px-2.5 py-1 rounded-xl shadow-lg bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-gray-700/50 text-gray-100 antialiased">
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
                    <span className="flex text-sm font-semibold px-2.5 py-1 rounded-xl shadow-lg bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-gray-700/50 text-gray-100 antialiased">
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
                    <span className={`text-sm font-semibold px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-sm antialiased ${
                      bet.status === 'green'
                        ? 'bg-gradient-to-br from-green-900/30 to-green-800/30 text-green-400 border border-green-500/50'
                        : 'bg-gradient-to-br from-red-900/30 to-red-800/30 text-red-400 border border-red-500/50'
                    }`}>
                      {bet.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  {bet.tips.map((tip, index) => (
                    <div key={index} className="flex flex-col gap-0.5">
                      <span className="text-blue-300 text-xs font-semibold">{tip.teams}</span>
                      <div className="flex items-center gap-2.5">
                        <p className="font-medium text-white text-base tracking-tight truncate">{tip.tip}</p>
                        <span className="text-sm font-semibold px-2.5 py-1 rounded-xl shadow-lg bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-gray-700/50 text-gray-100 antialiased">
                          {tip.odds}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2.5 mt-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex text-sm font-semibold px-2.5 py-1 rounded-xl shadow-lg bg-gradient-to-br from-blue-900/45 to-blue-800/45 backdrop-blur-sm text-blue-200 border border-blue-500/50 antialiased">
                        <img
                          src={bettingSites.find(site => site.value === bet.site)?.logo}
                          alt={bet.site}
                          className="w-[20px] h-[20px] mr-2 rounded shadow-md"
                          style={{ objectFit: 'cover', background: 'transparent' }}
                        />
                        Total: {bet.totalOdds}
                      </span>
                      {bet.balance && (
                        <span className="flex text-sm font-semibold px-2.5 py-1 rounded-xl shadow-lg bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm border border-gray-700/50 text-gray-100 antialiased">
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
                      <span className={`text-sm font-semibold px-2.5 py-1 rounded-xl shadow-lg backdrop-blur-sm antialiased ${
                        bet.status === 'green'
                          ? 'bg-gradient-to-br from-green-900/30 to-green-800/30 text-green-400 border border-green-500/50'
                          : 'bg-gradient-to-br from-red-900/30 to-red-800/30 text-red-400 border border-red-500/50'
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
                className="p-2 rounded-xl bg-gradient-to-br from-green-900/20 to-green-800/20 hover:from-green-600/30 hover:to-green-500/30 text-green-400 hover:text-green-300 transition-all duration-300 border border-green-500/30 hover:border-green-400/50 backdrop-blur-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Check size={18} />
              </button>
              <button
                onClick={onCancelEdit}
                className="p-2 rounded-xl bg-gradient-to-br from-red-900/20 to-red-800/20 hover:from-red-600/30 hover:to-red-500/30 text-red-400 hover:text-red-300 transition-all duration-300 border border-red-500/30 hover:border-red-400/50 backdrop-blur-lg shadow-lg hover:shadow-xl transform hover:scale-105"
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
                    className="p-2 rounded-xl bg-gradient-to-br from-green-900/20 to-green-800/20 hover:from-green-600/30 hover:to-green-500/30 text-green-400 hover:text-green-300 transition-all duration-300 border border-green-500/30 hover:border-green-400/50 backdrop-blur-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Check size={18} />
                  </button>
                  <button
                    onClick={() => onStatusChange?.(bet.id, 'red')}
                    className="p-2 rounded-xl bg-gradient-to-br from-red-900/20 to-red-800/20 hover:from-red-600/30 hover:to-red-500/30 text-red-400 hover:text-red-300 transition-all duration-300 border border-red-500/30 hover:border-red-400/50 backdrop-blur-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => onStatusChange?.(bet.id, bet.status === 'green' ? 'green' : 'red')}
                  className={`h-[34px] flex items-center text-xs font-semibold px-2.5 rounded-xl shadow-lg backdrop-blur-lg mr-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                    bet.status === 'green'
                      ? 'text-green-400 bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-500/50 hover:from-green-900/40 hover:to-green-800/40 hover:border-green-500/60'
                      : 'text-red-400 bg-gradient-to-br from-red-900/30 to-red-800/30 border border-red-500/50 hover:from-red-900/40 hover:to-red-800/40 hover:border-red-500/60'
                  }`}
                >
                  {bet.status.toUpperCase()}
                </button>
              )}
              <button
                onClick={() => onEdit?.(bet)}
                className="p-2 rounded-xl bg-gradient-to-br from-blue-900/20 to-blue-800/20 hover:from-blue-600/30 hover:to-blue-500/30 text-blue-400 hover:text-blue-300 transition-all duration-300 border border-blue-500/30 hover:border-blue-400/50 backdrop-blur-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onDelete?.(bet.id)}
                className="p-2 rounded-xl bg-gradient-to-br from-red-900/20 to-red-800/20 hover:from-red-600/30 hover:to-red-500/30 text-red-400 hover:text-red-300 transition-all duration-300 border border-red-500/30 hover:border-red-400/50 backdrop-blur-lg shadow-lg hover:shadow-xl transform hover:scale-105"
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
